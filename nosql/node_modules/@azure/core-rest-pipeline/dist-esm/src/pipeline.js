// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { logPolicy } from "./policies/logPolicy";
import { userAgentPolicy } from "./policies/userAgentPolicy";
import { redirectPolicy } from "./policies/redirectPolicy";
import { exponentialRetryPolicy } from "./policies/exponentialRetryPolicy";
import { tracingPolicy } from "./policies/tracingPolicy";
import { setClientRequestIdPolicy } from "./policies/setClientRequestIdPolicy";
import { throttlingRetryPolicy } from "./policies/throttlingRetryPolicy";
import { systemErrorRetryPolicy } from "./policies/systemErrorRetryPolicy";
import { decompressResponsePolicy } from "./policies/decompressResponsePolicy";
import { proxyPolicy } from "./policies/proxyPolicy";
import { isNode } from "./util/helpers";
import { formDataPolicy } from "./policies/formDataPolicy";
const ValidPhaseNames = new Set(["Deserialize", "Serialize", "Retry"]);
/**
 * A private implementation of Pipeline.
 * Do not export this class from the package.
 * @internal
 */
class HttpPipeline {
    constructor(policies = []) {
        this._policies = [];
        this._policies = policies;
        this._orderedPolicies = undefined;
    }
    addPolicy(policy, options = {}) {
        if (options.phase && options.afterPhase) {
            throw new Error("Policies inside a phase cannot specify afterPhase.");
        }
        if (options.phase && !ValidPhaseNames.has(options.phase)) {
            throw new Error(`Invalid phase name: ${options.phase}`);
        }
        if (options.afterPhase && !ValidPhaseNames.has(options.afterPhase)) {
            throw new Error(`Invalid afterPhase name: ${options.afterPhase}`);
        }
        this._policies.push({
            policy,
            options
        });
        this._orderedPolicies = undefined;
    }
    removePolicy(options) {
        const removedPolicies = [];
        this._policies = this._policies.filter((policyDescriptor) => {
            if ((options.name && policyDescriptor.policy.name === options.name) ||
                (options.phase && policyDescriptor.options.phase === options.phase)) {
                removedPolicies.push(policyDescriptor.policy);
                return false;
            }
            else {
                return true;
            }
        });
        this._orderedPolicies = undefined;
        return removedPolicies;
    }
    sendRequest(httpClient, request) {
        const policies = this.getOrderedPolicies();
        const pipeline = policies.reduceRight((next, policy) => {
            return (req) => {
                return policy.sendRequest(req, next);
            };
        }, (req) => httpClient.sendRequest(req));
        return pipeline(request);
    }
    getOrderedPolicies() {
        if (!this._orderedPolicies) {
            this._orderedPolicies = this.orderPolicies();
        }
        return this._orderedPolicies;
    }
    clone() {
        return new HttpPipeline(this._policies);
    }
    static create() {
        return new HttpPipeline();
    }
    orderPolicies() {
        /**
         * The goal of this method is to reliably order pipeline policies
         * based on their declared requirements when they were added.
         *
         * Order is first determined by phase:
         *
         * 1. Serialize Phase
         * 2. Policies not in a phase
         * 3. Deserialize Phase
         * 4. Retry Phase
         *
         * Within each phase, policies are executed in the order
         * they were added unless they were specified to execute
         * before/after other policies or after a particular phase.
         *
         * To determine the final order, we will walk the policy list
         * in phase order multiple times until all dependencies are
         * satisfied.
         *
         * `afterPolicies` are the set of policies that must be
         * executed before a given policy. This requirement is
         * considered satisfied when each of the listed policies
         * have been scheduled.
         *
         * `beforePolicies` are the set of policies that must be
         * executed after a given policy. Since this dependency
         * can be expressed by converting it into a equivalent
         * `afterPolicies` declarations, they are normalized
         * into that form for simplicity.
         *
         * An `afterPhase` dependency is considered satisfied when all
         * policies in that phase have scheduled.
         *
         */
        const result = [];
        // Track all policies we know about.
        const policyMap = new Map();
        // Track policies for each phase.
        const serializePhase = new Set();
        const noPhase = new Set();
        const deserializePhase = new Set();
        const retryPhase = new Set();
        // a list of phases in order
        const orderedPhases = [serializePhase, noPhase, deserializePhase, retryPhase];
        // Small helper function to map phase name to each Set bucket.
        function getPhase(phase) {
            if (phase === "Retry") {
                return retryPhase;
            }
            else if (phase === "Serialize") {
                return serializePhase;
            }
            else if (phase === "Deserialize") {
                return deserializePhase;
            }
            else {
                return noPhase;
            }
        }
        // First walk each policy and create a node to track metadata.
        for (const descriptor of this._policies) {
            const policy = descriptor.policy;
            const options = descriptor.options;
            const policyName = policy.name;
            if (policyMap.has(policyName)) {
                throw new Error("Duplicate policy names not allowed in pipeline");
            }
            const node = {
                policy,
                dependsOn: new Set(),
                dependants: new Set()
            };
            if (options.afterPhase) {
                node.afterPhase = getPhase(options.afterPhase);
            }
            policyMap.set(policyName, node);
            const phase = getPhase(options.phase);
            phase.add(node);
        }
        // Now that each policy has a node, connect dependency references.
        for (const descriptor of this._policies) {
            const { policy, options } = descriptor;
            const policyName = policy.name;
            const node = policyMap.get(policyName);
            if (!node) {
                throw new Error(`Missing node for policy ${policyName}`);
            }
            if (options.afterPolicies) {
                for (const afterPolicyName of options.afterPolicies) {
                    const afterNode = policyMap.get(afterPolicyName);
                    if (afterNode) {
                        // Linking in both directions helps later
                        // when we want to notify dependants.
                        node.dependsOn.add(afterNode);
                        afterNode.dependants.add(node);
                    }
                }
            }
            if (options.beforePolicies) {
                for (const beforePolicyName of options.beforePolicies) {
                    const beforeNode = policyMap.get(beforePolicyName);
                    if (beforeNode) {
                        // To execute before another node, make it
                        // depend on the current node.
                        beforeNode.dependsOn.add(node);
                        node.dependants.add(beforeNode);
                    }
                }
            }
        }
        function walkPhase(phase) {
            // Sets iterate in insertion order
            for (const node of phase) {
                if (node.afterPhase && node.afterPhase.size) {
                    // If this node is waiting on a phase to complete,
                    // we need to skip it for now.
                    continue;
                }
                if (node.dependsOn.size === 0) {
                    // If there's nothing else we're waiting for, we can
                    // add this policy to the result list.
                    result.push(node.policy);
                    // Notify anything that depends on this policy that
                    // the policy has been scheduled.
                    for (const dependant of node.dependants) {
                        dependant.dependsOn.delete(node);
                    }
                    policyMap.delete(node.policy.name);
                    phase.delete(node);
                }
            }
        }
        function walkPhases() {
            let noPhaseRan = false;
            for (const phase of orderedPhases) {
                walkPhase(phase);
                if (phase === noPhase) {
                    noPhaseRan = true;
                }
                // if the phase isn't complete
                if (phase.size > 0 && phase !== noPhase) {
                    if (noPhaseRan === false) {
                        // Try running noPhase to see if that unblocks this phase next tick.
                        // This can happen if a phase that happens before noPhase
                        // is waiting on a noPhase policy to complete.
                        walkPhase(noPhase);
                    }
                    // Don't proceed to the next phase until this phase finishes.
                    return;
                }
            }
        }
        // Iterate until we've put every node in the result list.
        while (policyMap.size > 0) {
            const initialResultLength = result.length;
            // Keep walking each phase in order until we can order every node.
            walkPhases();
            // The result list *should* get at least one larger each time.
            // Otherwise, we're going to loop forever.
            if (result.length <= initialResultLength) {
                throw new Error("Cannot satisfy policy dependencies due to requirements cycle.");
            }
        }
        return result;
    }
}
/**
 * Creates a totally empty pipeline.
 * Useful for testing or creating a custom one.
 */
export function createEmptyPipeline() {
    return HttpPipeline.create();
}
/**
 * Create a new pipeline with a default set of customizable policies.
 * @param options - Options to configure a custom pipeline.
 */
export function createPipelineFromOptions(options) {
    const pipeline = HttpPipeline.create();
    if (isNode) {
        pipeline.addPolicy(proxyPolicy(options.proxyOptions));
        pipeline.addPolicy(decompressResponsePolicy());
    }
    pipeline.addPolicy(formDataPolicy());
    pipeline.addPolicy(tracingPolicy(options.userAgentOptions));
    pipeline.addPolicy(userAgentPolicy(options.userAgentOptions));
    pipeline.addPolicy(setClientRequestIdPolicy());
    pipeline.addPolicy(throttlingRetryPolicy(), { phase: "Retry" });
    pipeline.addPolicy(systemErrorRetryPolicy(options.retryOptions), { phase: "Retry" });
    pipeline.addPolicy(exponentialRetryPolicy(options.retryOptions), { phase: "Retry" });
    pipeline.addPolicy(redirectPolicy(options.redirectOptions), { afterPhase: "Retry" });
    pipeline.addPolicy(logPolicy(options.loggingOptions), { afterPhase: "Retry" });
    return pipeline;
}
//# sourceMappingURL=pipeline.js.map
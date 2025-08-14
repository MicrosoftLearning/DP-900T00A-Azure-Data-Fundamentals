---
lab:
    title: 'Explore Azure Storage'
    module: 'Explore Azure Storage for non-relational data'
---

# Explore Azure Storage

In this exercise you'll provision an Azure Storage account in your Azure subscription, and explore the various ways you can use it to store data.

This lab will take approximately **15** minutes to complete.

> _**Tip**: Understanding the purpose of each action helps you later design storage solutions that balance cost, performance, security, and analytics goals. These brief Why notes tie each step to a real-world reason._

## Before you start

You'll need an [Azure subscription](https://azure.microsoft.com/free) in which you have administrative-level access.

## Provision an Azure Storage account

The first step in using Azure Storage is to provision an Azure Storage account in your Azure subscription.

> _**Tip**: A storage account is the secure, billable boundary for all Azure Storage services (blobs, files, queues, tables). Policies, redundancy, encryption, networking, and access control apply from here downward._

1. If you haven't already done so, sign into the [Azure portal](https://portal.azure.com?azure-portal=true).

1. On the Azure portal home page, select **&#65291; Create a resource** from the upper left-hand corner and search for `Storage account`. Then in the resulting **Storage account** page, select **Create**.

1. Enter the following values on the **Create a storage account** page:
   
    - **Subscription**: Select your Azure subscription.
    - **Resource group**:  Create a new resource group with a name of your choice.
    - **Storage account name**: Enter a unique name for your storage account using lower-case letters and numbers.
    - **Region**:  Select any available location.
    - **Performance**: *Standard*
    - **Redundancy**: *Locally-redundant storage (LRS)*

    > _**Tip**: A new resource group makes cleanup easy. Standard + LRS is the lowest-cost baseline, good for learning. LRS keeps three synchronous copies in one region, adequate for non-critical demo data without paying for geo-replication._


1. Select **Next: Advanced >** and view the advanced configuration options. In particular, note that this is where you can enable hierarchical namespace to support Azure Data Lake Storage Gen2. Leave this option **<u>unselected</u>** (you'll enable it later), and then select **Next: Networking >** to view the networking options for your storage account.

1. Select **Next: Data protection >** and then in the **Recovery** section, <u>de</u>select all of the **Enable soft delete...** options. These options retain deleted files for subsequent recovery, but can cause issues later when you enable hierarchical namespace.

1. Continue through the remaining **Next >** pages without changing any of the default settings, and then on the  **Review** page, wait for your selections to be validated and select **Create** to create your Azure Storage account.

1. Wait for deployment to complete. Then go to the resource that was deployed.

## Explore blob storage

Now that you have an Azure Storage account, you can create a container for blob data.

> _**Tip**: A container groups blobs and is the first scoping level for access control. Starting with plain blob storage (no hierarchical namespace) shows virtual folder behavior you'll compare to Data Lake Gen2 later._

1. Download the [product1.json](https://aka.ms/product1.json?azure-portal=true) JSON file from `https://aka.ms/product1.json` and save it on your computer (you can save it in any folder - you'll upload it to blob storage later).

    *If the JSON file is displayed in your browser, save the page as **product1.json**.*

1. In the Azure portal page for your storage container, on the left side, in the **Data storage** section, select **Containers**.

1. In the **Containers** page, select **&#65291; Container** and add a new container named `data` with an anonymous access level of **Private (no anonymous access)**.

    > _**Tip**: Private keeps your sample data secure. Public access is rarely needed except for static website or open data scenarios. Naming it `data` keeps this example simple and readable._

1. When the **data** container has been created, verify that it's listed in the **Containers** page.

1. In the pane on the left side, in the top section, select **Storage browser**. This page provides a browser-based interface that you can use to work with the data in your storage account.

1. In the storage browser page, select **Blob containers** and verify that your **data** container is listed.

1. Select the **data** container, and note that it's empty.

1. Select **&#65291; Add Directory** and read the information about folders before creating a new directory named `products`.

1. In storage browser, verify that the current view shows the contents of the **products** folder you just created - observe that the "breadcrumbs" at the top of the page reflect the path **Blob containers > data > products**.

1. In the breadcrumbs, select **data** to switch to the **data** container, and note that it does <u>not</u> contain a folder named **products**.

    Folders in blob storage are virtual, and only exist as part of the path of a blob. Since the **products** folder contained no blobs, it isn't really there!

    > _**Tip**: Flat namespace means directories are just name prefixes (products/file.json). This design enables massive scale because the service indexes blob names instead of maintaining a true tree structure._

1. Use the **&#10514; Upload** button to open the **Upload blob** panel.

1. In the **Upload blob** panel, select the **product1.json** file you saved on your local computer previously. Then in the **Advanced** section, in the **Upload to folder** box, enter `product_data` and select the **Upload** button.

    > _**Tip**: Supplying a folder name while uploading auto-creates the virtual path, illustrating that presence of a blob makes the "folder" appear._

1. Close the **Upload blob** panel if it's still open, and verify that a **product_data** virtual folder has been created in the **data** container.

1. Select the **product_data** folder and verify that it contains the **product1.json** blob you uploaded.

1. On the left side, in the **Data storage** section, select **Containers**.

1. Open the **data** container, and verify that the **product_data** folder you created is listed.

1. Select the **&#x2027;&#x2027;&#x2027;** icon at the right-end of the folder, and note that it doesn't display any options. Folders in a flat namespace blob container are virtual, and can't be managed.

    > _**Tip**: No real directory object exists, so there are no rename/permission operations — those require hierarchical namespace._

1. Use the **X** icon at the top right in the **data** page to close the page and return to the **Containers** page.

## Explore Azure Data Lake Storage Gen2

Azure Data Lake Store Gen2 support enables you to use hierarchical folders to organize and manage access to blobs. It also enables you to use Azure blob storage to host distributed file systems for common big data analytics platforms.

> _**Tip**: Enabling hierarchical namespace converts virtual paths into real directories, adds atomic directory operations, and unlocks POSIX-like ACLs — vital for large analytics (Spark/Hadoop) and governed data lakes._

1. Download the [product2.json](https://aka.ms/product2.json?azure-portal=true) JSON file from `https://aka.ms/product2.json` and save it on your computer in the same folder where you downloaded **product1.json** previously - you'll upload it to blob storage later.

1. In the Azure portal page for your storage account, on the left side, scroll down to the **Settings** section, and select **Data Lake Gen2 upgrade**.

1. In the **Data Lake Gen2 upgrade** page, expand and complete each step to upgrade your storage account to enable hierarchical namespace and support Azure Data Lake Storage Gen. This may take some time.

    > _**Tip**: The upgrade is an account-level capability switch — data remains, but directory semantics change to support advanced operations._

1. When the upgrade is complete, in the pane on the left side, in the top section, select **Storage browser** and navigate back to the root of your **data** blob container, which still contains the **product_data** folder.

1. Select the **product_data** folder, and verify it still contains the **product1.json** file you uploaded previously.

1. Use the **&#10514; Upload** button to open the **Upload blob** panel.

1. In the **Upload blob** panel, select the **product2.json** file you saved on your local computer. Then select the **Upload** button.

1. Close the **Upload blob** panel if it's still open, and verify that a **product_data** folder now contains the **product2.json** file.

    > _**Tip**: Adding a second file post-upgrade confirms seamless continuity: existing blobs still work, and new ones gain hierarchical benefits such as directory ACLs._

1. On the left side, in the **Data storage** section, select **Containers**.

1. Open the **data** container, and verify that the **product_data** folder you created is listed.

1. Select the **&#x2027;&#x2027;&#x2027;** icon at the right-end of the folder, and note that with hierarchical namespace enabled, you can perform configuration tasks at the folder-level; including renaming folders and setting permissions.

    > _**Tip**: Real folders let you apply least-privilege security at folder granularity, rename safely, and speed recursive listings versus scanning thousands of prefixed blob names._

1. Use the **X** icon at the top right in the **data** page to close the page and return to the **Containers** page.

## Explore Azure Files

Azure Files provides a way to create cloud-based file shares.

> _**Tip**: Azure Files offers SMB/NFS endpoints for lift‑and‑shift scenarios where apps expect a traditional file system. It complements (not replaces) blob storage by supporting file locks and OS-native tooling._

1. In the Azure portal page for your storage container, on the left side, in the **Data storage** section, select **File shares**.

1. In the File shares page, select **&#65291; File share** and add a new file share named `files` using the **Transaction optimized** tier.

1. Select **Next: Backup >** and disable backup. Then select **Review + create**.

    > _**Tip**:  Disabling backup keeps costs down for a short-lived lab environment — you would enable it for production resilience._

1. In the **File shares**, open your new **files** share.

1. At the top of the page, select **Connect**. Then in the **Connect** pane, note that there are tabs for common operating systems (Windows, Linux, and macOS) that contain scripts you can run to connect to the shared folder from a client computer.

    > _**Tip**: The generated scripts show exactly how to mount the share using platform-native commands, illustrating hybrid access patterns from virtual machines, containers, or on-prem servers._

1. Close the **Connect** pane and then close the **files** page to return to the **File shares** page for your Azure storage account.

## Explore Azure Tables

Azure Tables provide a key/value store for applications that need to store data values, but don't need the full functionality and structure of a relational database.

> _**Tip**: Table storage trades rich querying & joins for ultra-low cost, schemaless flexibility, and horizontal scale — ideal for logs, IoT states, or user profiles._

1. In the Azure portal page for your storage container, on the left side, in the **Data storage** section, select **Tables**.

1. On the **Tables** page, select **&#65291; Table** and create a new table named `products`.

1. After the **products** table has been created, in the pane on the left side, in the top section, select **Storage browser**.

1. In storage explorer, select **Tables** and verify that the **products** table is listed.

1. Select the **products** table.

1. In the **product** page, select **&#65291; Add entity**.

1. In the **Add entity** panel, enter the following key values:
    - **PartitionKey**: 1
    - **RowKey**: 1

    > _**Tip**: PartitionKey groups related entities to distribute load; RowKey uniquely identifies within the partition. Together they form a fast composite primary key for lookups._

1. Select **Add property**, and create a new property with the following values:

    |Property name | Type | Value |
    | ------------ | ---- | ----- |
    | Name | String | Widget |

1. Add a second property with the following values:

    |Property name | Type | Value |
    | ------------ | ---- | ----- |
    | Price | Double | 2.99 |

1. Select **Insert** to insert a row for the new entity into the table.

1. In storage browser, verify that a row has been added to the **products** table, and that a **Timestamp** column has been created to indicate when the row was last modified.

1. Add another entity to the **products** table with the following properties:

    |Property name | Type | Value |
    | ------------ | ---- | ----- |
    | PartitionKey | String | 1 |
    | RowKey | String | 2 |
    | Name | String | Kniknak |
    | Price | Double | 1.99 |
    | Discontinued | Boolean | true |

    > _**Tip**: Adding a second entity with different keys and an extra Boolean property demonstrates schema-on-write flexibility — new attributes don't require a migration._

1. After inserting the new entity, verify that a row containing the discontinued product is shown in the table.

    You have manually entered data into the table using the storage browser interface. In a real scenario, application developers can use the Azure Storage Table API to build applications that read and write values to tables, making it a cost effective and scalable solution for NoSQL storage.

> **Tip**: If you've finished exploring Azure Storage, you can delete the resource group that you created in this exercise. Deleting the resource group is the quickest way to avoid ongoing charges by removing every resource you created in one action._

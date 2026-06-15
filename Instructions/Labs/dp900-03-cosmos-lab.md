---
lab:
  title: Explore Azure Cosmos DB
  module: Explore fundamentals of Azure Cosmos DB
  description: In this lab, you'll create an Azure Cosmos DB account, add a sample database and container, and add and query JSON items using the Azure portal. The lab is written for absolute beginners with no prior Azure or NoSQL experience, so every step is explained in plain language.
  duration: 30 minutes
  level: 100
  islab: true
  primarytopics:
    - Azure
    - Azure Cosmos DB
    - Azure Portal
---

# Explore Azure Cosmos DB

In this lab, you'll create your first **NoSQL** database using **Azure Cosmos DB**. "NoSQL" databases store data in a flexible way, rather than in the strict rows-and-columns tables of a relational database. Cosmos DB stores each piece of data as a **JSON item** (a simple text format that lists properties and their values, like `"price": 48.74`).

You'll create ("provision") a Cosmos DB account, add some sample data, view it as JSON, and then run simple SQL-like queries to find what you're looking for. Don't worry if these terms are new, every step is explained as you go.

This lab will take approximately **30** minutes to complete.

## Before you start

You'll need an [Azure subscription](https://azure.microsoft.com/free) in which you have administrative-level access. If you don't have one, you can sign up for a free account using the link above.

> _**What is Azure?** Azure is Microsoft's cloud platform. Instead of buying and running your own server computer, you rent computing resources (like a database) from Microsoft and use them over the internet. The **Azure portal** is the website you use to create and manage those resources._

## Create a Cosmos DB account

"Provisioning" just means creating and setting up a new resource. To use Cosmos DB, you first create a Cosmos DB account. In this lab, you'll create an account that uses **Azure Cosmos DB for NoSQL**, the option designed for storing and querying JSON data.

1. In the Azure portal, select **+ Create a resource** at the top left, and search for `Azure Cosmos DB`.  In the results, select **Azure Cosmos DB** and select  **Create**.

    ![Screenshot of the Azure Marketplace search results with the Azure Cosmos DB tile and its Create button highlighted.](images/dp900-03-cosmos-lab-marketplace.png)

1. In the **Azure Cosmos DB for NoSQL** tile, select **Create**.

    ![Screenshot of the API selection page with the Create button on the Azure Cosmos DB for NoSQL tile.](images/dp900-03-cosmos-lab-select-api.png)

    > _**Tip**: The account is the top level for your Cosmos DB resources. Choosing Azure Cosmos DB for NoSQL lets you store and query JSON data with a simple, SQL-like query language._

1. Enter the following details, and then select **Review + create**:
   
    - **Workload Type**: Learning
    - **Subscription**: If you're using a sandbox, select *Concierge Subscription*. Otherwise, select your Azure subscription.
    - **Resource group**:  If you're using a sandbox, select the existing resource group (which will have a name like *learn-xxxx...*). Otherwise, create a new resource group with a name of your choice.
    - **Account Name**: Enter a unique name
    - **Availability Zones**: Disable
    - **Location**: Choose any recommended location
    - **Capacity mode**: Provisioned throughput
    - **Apply Free-Tier Discount**: Select Apply if available
    - **Limit total account throughput**: Unselected
  
    > _**Why these choices?**_
    >
    > _We’re setting the **workload type** to Learning because it comes with beginner-friendly defaults that make setup easier and keep costs low. Your **account name** needs to be unique across the whole service, since it becomes part of your service’s URL. We’re picking a **location** close to you so your tests run faster; which locations you see will depend on your subscription and whether certain availability zones are enabled. For **capacity mode**, we’re going with Provisioned throughput so performance stays predictable during this short lab—though Serverless can be fine if you only need it occasionally. If the **free tier** is available, we’ll use it so you can experiment without racking up charges. Finally, we’re keeping the “**limit total account throughput**” setting turned off so nothing gets slowed down unexpectedly while you work._

    ![Screenshot of the Create Azure Cosmos DB Account Basics tab with the workload type, subscription, resource group, account name, and location filled in.](images/dp900-03-cosmos-lab-basics.png)

1. When the configuration has been validated, select **Create**.

    ![Screenshot of the Review + create tab showing Validation Success and the account settings summary with the Create button.](images/dp900-03-cosmos-lab-review-create.png)

    > _**Tip**: Azure portal will estimate how long it will take to provision this instance of Azure Cosmos DB. The estimated creation time is calculated based on the location you have selected._

1. Wait for deployment to complete. Then go to the deployed resource.

## Create a sample database

*Throughout this procedure, close any tips that are displayed in the portal*.

1. On the page for your new Cosmos DB account, in the pane on the left, select **Data Explorer**.

    ![Screenshot of the Azure Cosmos DB account page with Data Explorer selected in the left navigation pane.](images/dp900-03-cosmos-lab-overview.png)

1. In the **Data Explorer** page, select **Launch quick start**.

    ![Screenshot of the Data Explorer welcome page with the Launch quick start tile highlighted.](images/dp900-03-cosmos-lab-data-explorer.png)

    > _**Tip**: Quick start creates a working database, container, and sample data so you can practice adding and querying items without designing a schema first._

1. In the **New Container** pane, review the pre-populated settings for the sample database (a database named **SampleDB**, a container named **SampleContainer**, and a partition key of **/categoryId**), and then select **OK**. A short guided tutorial may appear alongside the pane; you can step through it with **Next** or simply select **OK** to continue.

    ![Screenshot of the New Container pane showing the pre-populated SampleDB database, SampleContainer container, and partition key settings.](images/dp900-03-cosmos-lab-quick-start.png)

    > _**What is a partition key?** When you create a container, Azure Cosmos DB asks for a **partition key**, a property in your data (for example, `categoryId`) that it uses to group related items together. Cosmos DB spreads these groups across the storage and compute behind the scenes so your database stays fast as it grows. You don't need to choose one here because Quick Start picks a sensible partition key for you, but in a real project choosing a good partition key, one with many distinct values that your queries filter on, is one of the most important design decisions you'll make._

1. Observe the status in the panel at the bottom of the screen until the **SampleDB** database and its **SampleContainer** container has been created (which may take a minute or so).

## View and create items

1. In the Data Explorer page, expand the **SampleDB** database and the **SampleContainer** container, and select **Items** to see a list of items in the container. The items represent product data, each with a unique id and other properties. Select any item to see a JSON representation of its data in the pane on the right.

    ![Screenshot of the Items view listing sample product items, with the JSON of the selected item shown on the right.](images/dp900-03-cosmos-lab-items.png)

1. At the top of the page, select **New Item** to create a new blank item.

1. Modify the JSON for the new item as follows, and then select **Save**.

    ```json
   {
       "name": "Road Helmet,45",
       "id": "123456789",
       "categoryId": "123456789",
       "SKU": "AB-1234-56",
       "description": "The product called \"Road Helmet,45\" ",
       "price": 48.74
   }
    ```

    ![Screenshot of the New Item editor in Data Explorer with the product JSON entered and the Save button in the toolbar.](images/dp900-03-cosmos-lab-new-item.png)

1. After saving the new item, notice that additional metadata properties are added automatically.

    > _**Tip**: Cosmos DB stores items as JSON (JavaScript Object Notation), so you can add fields that fit your scenario without a rigid schema. The `id` must be unique within the container. After you save, Cosmos DB adds system properties (like timestamps and internal identifiers) to help manage and optimize your data:_
    > - *_rid — The internal resource ID used by Cosmos DB to identify the item internally.*
    > - *_self — The full resource link for the item.*
    > - *_etag — The entity tag used for optimistic concurrency checks.*
    > - *_ts — The Unix timestamp (in seconds) when the item was last modified.*
    > - *_attachments — A link to the document’s attachments (if any).*

## Query the database

1. In the **Data Explorer** page, select the **New SQL Query** icon.

    ![Screenshot of the Data Explorer with a new query tab open showing the default SELECT star FROM c query and the Execute Query button.](images/dp900-03-cosmos-lab-new-sqlquery.png)

1. In the SQL Query editor, review the default query (`SELECT * FROM c`) and use the **Execute Query** button to run it.

1. Review the results, which includes the full JSON representation of all items.

1. Modify the query as follows:

    ```sql
   SELECT *
   FROM c
   WHERE CONTAINS(c.name,"Helmet")
    ```

    > _**Tip**: The NoSQL API uses familiar, SQL-like queries to search JSON documents. `SELECT * FROM c` lists all items, and `CONTAINS` filters by text inside a property—useful for quick searches without extra setup._

1. Use the **Execute Query** button to run the revised query and review the results, which includes JSON entities for any items with a **name** field containing the text "Helmet".

    ![Screenshot of the query editor running the CONTAINS query with the matching helmet items shown in the Results pane.](images/dp900-03-cosmos-lab-query.png)

1. Close the SQL Query editor, discarding your changes.

    You've seen how to create and query JSON entities in a Cosmos DB database by using the data explorer interface in the Azure portal. In a real scenario, an application developer would use one of the many programming language specific software development kits (SDKs) to call the NoSQL API and work with data in the database.

## Clean up

When you've finished exploring Azure Cosmos DB, you should delete the resources you created so you don't incur any further costs.

1. In the Azure portal, navigate to the **resource group** that contains your Cosmos DB account.

1. Select **Delete resource group**, confirm the deletion by entering the resource group name, and select **Delete**.

    > _**Tip:** Deleting the resource group removes the Cosmos DB account and everything inside it in a single step. This is the quickest way to make sure nothing is left running and costing money._

In this lab, you created an Azure Cosmos DB account, added JSON items, and queried them using a SQL-like language. You've taken your first steps with NoSQL data in the cloud!

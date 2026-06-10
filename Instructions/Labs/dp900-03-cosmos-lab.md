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

    ![Screenshot of the Azure Portal showing cosmos db in the marketplace](images/cosmosdb-marketplace.png)

1. In the **Azure Cosmos DB for NoSQL** tile, select **Create**.

    ![Screenshot of the Azure Portal showing cosmos db create option](images/cosmosdb-nosql-create.png)
   
    > _**Tip**: The account is the top level for your Cosmos DB resources. Choosing Azure Cosmos DB for NoSQL lets you store and query JSON data with a simple, SQL-like query language._

1. Enter the following details, and then select **Review + Create**:
   
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

1. When the configuration has been validated, select **Create**.

    > _**Tip**: Azure Portal will estimate how long it will take to provision this instance of CosmosDB. The estimated creation time is calculated based on the location you have selected._

1. Wait for deployment to complete. Then go to the deployed resource.

## Create a sample database

*Throughout this procedure, close any tips that are displayed in the portal*.

1. On the page for your new Cosmos DB account, in the pane on the left, select **Data Explorer**.

    ![Screenshot of the Azure Portal Comsos DB Data Explorer menu](images/cosmosdb-data-explorer.png)

1. In the **Data Explorer** page, select **Launch quick start**.

    > _**Tip**: Quick start creates a working database, container, and sample data so you can practice adding and querying items without designing a schema first._

1. In the **New container** tab, review the pre-populated settings for the sample database, and then select **OK**.

1. Observe the status in the panel at the bottom of the screen until the **SampleDB** database and its **SampleContainer** container has been created (which may take a minute or so).

## View and create items

1. In the Data Explorer page, expand the **SampleDB** database and the **SampleContainer** container, and select **Items** to see a list of items in the container. The items represent product data, each with a unique id and other properties.

    ![Screenshot of the Azure Portal Comsos DB Data Explorer items](images/cosmosdb-items.png)

1. Select any of the items in the list to see a JSON representation of the item data.

1. At the top of the page, select **New Item** to create a new blank item.

1. Modify the JSON for the new item as follows, and then select **Save**.

    ```json
   {
       "name": "Road Helmet,45",
       "id": "123456789",
       "categoryID": "123456789",
       "SKU": "AB-1234-56",
       "description": "The product called \"Road Helmet,45\" ",
       "price": 48.74
   }
    ```

    ![Screenshot of the Azure Portal Comsos DB Data Explorer new item](images/cosmosdb-new-item.png)

1. After saving the new item, notice that additional metadata properties are added automatically.

    > _**Tip**: Cosmos DB stores items as JSON (JavaScript Object Notation), so you can add fields that fit your scenario without a rigid schema. The `id` must be unique within the container. After you save, Cosmos DB adds system properties (like timestamps and internal identifiers) to help manage and optimize your data:_
    > - *_rid — The internal resource ID used by Cosmos DB to identify the item internally.*
    > - *_self — The full resource link for the item.*
    > - *_etag — The entity tag used for optimistic concurrency checks.*
    > - *_ts — The Unix timestamp (in seconds) when the item was last modified.*
    > - *_attachments — A link to the document’s attachments (if any).*

## Query the database

1. In the **Data Explorer** page, select the **New SQL Query** icon.

    ![Screenshot of the Azure Portal Comsos DB Data Explorer new sql query](images/cosmosdb-new-sqlquery.png)

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

    ![Screenshot of the Azure Portal Comsos DB Data Explorer sql query executed](images/cosmosdb-query.png)

1. Close the SQL Query editor, discarding your changes.

    You've seen how to create and query JSON entities in a Cosmos DB database by using the data explorer interface in the Azure portal. In a real scenario, an application developer would use one of the many programming language specific software development kits (SDKs) to call the NoSQL API and work with data in the database.

## Clean up

When you've finished exploring Azure Cosmos DB, you should delete the resources you created so you don't incur any further costs.

1. In the Azure portal, navigate to the **resource group** that contains your Cosmos DB account.

1. Select **Delete resource group**, confirm the deletion by entering the resource group name, and select **Delete**.

    > _**Tip:** Deleting the resource group removes the Cosmos DB account and everything inside it in a single step. This is the quickest way to make sure nothing is left running and costing money._

In this lab, you created an Azure Cosmos DB account, added JSON items, and queried them using a SQL-like language. You've taken your first steps with NoSQL data in the cloud!

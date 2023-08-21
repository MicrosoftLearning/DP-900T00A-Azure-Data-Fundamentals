---
lab:
    title: 'Explore data analytics in Microsoft Fabric'
    module: 'Explore fundamentals of large-scale data analytics'
---

# Explore data analytics in Microsoft Fabric

In this exercise you'll explore data ingestion and analytics in a Microsoft Fabric Lakehouse.

This lab will take approximately **25** minutes to complete.

> **Note**: You'll need a Microsoft Fabric license to complete this exercise. See [Getting started with Fabric](https://learn.microsoft.com/fabric/get-started/fabric-trial) for details of how to enable a free Fabric trial license. You will need a Microsoft *school* or *work* account to do this. If you don't have one, you can [sign up for a trial of Microsoft Office 365 E3 or higher](https://www.microsoft.com/microsoft-365/business/compare-more-office-365-for-business-plans).

## Create a workspace

Before working with data in Fabric, create a workspace with the Fabric trial enabled.

1. Sign into [Microsoft Fabric](https://app.fabric.microsoft.com) at `https://app.fabric.microsoft.com`.
2. In the menu bar on the left, select **Workspaces** (the icon looks similar to &#128455;).
3. Create a new workspace with a name of your choice, selecting a licensing mode in the **Advanced** section that includes Fabric capacity (*Trial*, *Premium*, or *Fabric*).
4. When your new workspace opens, it should be empty.

    ![Screenshot of an empty workspace in Power BI.](./images/new-workspace.png)

## Create a lakehouse

Now that you have a workspace, it's time to switch to the *Data engineering* experience in the portal and create a data lakehouse for your data files.

1. At the bottom left of the portal, switch to the **Data Engineering** experience.

    ![Screenshot of the experience switcher menu.](./images/fabric-switcher.png)

    The data engineering home page includes tiles to create commonly used data engineering assets.

2. In the **Data engineering** home page, create a new **Lakehouse** with a name of your choice.

    After a minute or so, a new lakehouse will be created:

    ![Screenshot of a new lakehouse.](./images/new-lakehouse.png)

3. View the new lakehouse, and note that the **Lakehouse explorer** pane on the left enables you to browse tables and files in the lakehouse:
    - The **Tables** folder contains tables that you can query using SQL. Tables in a Microsoft Fabric lakehouse are based on the open source *Delta Lake* file format, commonly used in Apache Spark.
    - The **Files** folder contains data files in the OneLake storage for the lakehouse that aren't associated with managed delta tables. You can also create *shortcuts* in this folder to reference data that is stored externally.

    Currently, there are no tables or files in the lakehouse.

## Ingest data

A simple way to ingest data is to use a **Copy Data** activity in a pipeline to extract the data from a source and copy it to a file in the lakehouse.

1. On the **Home** page for your lakehouse, in the **Get data** menu, select **New data pipeline**, and create a new data pipeline named **Ingest Sales Data**.
1. In the **Copy Data** wizard, on the **Choose a data source** page, select the **Retail Data Model from Wide World Importers** sample dataset.

    ![Screenshot of the Choose data source page.](./images/choose-data-source.png)

1. Select **Next** and view the tables in the data source on the **Connect to data source** page.
1. Select the **dimension_stock_item** table, which contains records of products. Then select **Next** to progress to the **Choose data destination** page.
1. On the **Choose data destination** page, select your existing lakehouse. Then select **Next**.
1. Set the following data destination options, and then select **Next**:
    - **Root folder**: Tables
    - **Load settings**: Load to new table
    - **Destination table name**: dimension_stock_item
    - **Column mappings**: *Leave the default mappings as-is*
    - **Enable partition**: *Unselected*
1. On the **Review + save** page, ensure that the **Start data transfer immediately** option is selected, and then select **Save + Run**.

    A new pipeline containing a **Copy Data** activity is created, as shown here:

    ![Screenshot of a pipeline with a Copy Data activity.](./images/copy-data-pipeline.png)

    When the pipeline starts to run, you can monitor its status in the **Output** pane under the pipeline designer. Use the **&#8635;** (*Refresh*) icon to refresh the status, and wait until it has succeeeded.

1. In the hub menu bar on the left, select your lakehouse.
1. On the **Home** page, in the **Lakehouse explorer** pane, expand **Tables** and verify that the **dimension_stock_item** table has been created.

    > **Note**: If the new table is listed as *unidentified*, use the **Refresh** button in the lakehouse toolbar to refresh the view.

1. Select the **dimension_stock_item** table to view its contents.

    ![Screenshot of the dimension_stock_item table.](./images/dimProduct.png)

## Query data in a lakehouse

Now that you have ingested data into a table in the lakehouse, you can use SQL to query it.

1. At the top right of the Lakehouse page, switch to the **SQL endpoint** for your lakehouse.

    ![Screenshot of the SQL endpoint menu.](./images/endpoint-switcher.png)

1. In the toolbar, select **New SQL query**. Then enter the following SQL code into the query editor:

    ```sql
    SELECT Brand, COUNT(StockItemKey) AS Products
    FROM dimension_stock_item
    GROUP BY Brand
    ```

1. Select the **&#9655; Run** button to run the query and review the results, which should reveal that there are two brand values (*N/A* and *Northwind*) and show the number of products in each.

    ![Screenshot of a SQL query.](./images/sql-query.png)

## Visualize data in a lakehouse

Microsoft Fabric lakehouses organize all tables in a data model, which you can use to create visualizations and reports.

1. At the bottom left of the page, under the **Explorer** pane, select the **Model** tab to see the data model for the tables in the lakehouse (in this case there is only one table).

    ![Screenshot of the model page in a Fabric lakehouse.](./images/fabric-model.png)

1. In the toolbar, select **New report** to open a new browser tab containing the Power BI report designer.
1. In the report designer:
    1. In the **Data** pane, expand the **dimension_stock_item** table and select the **Brand** and **StockItemKey** fields.
    1. In the **Visualizations** pane, select the **Stacked bar chart** visualization (it's the first one listed). Then ensure that the **Y-axis** contains the **Brand** field and change the aggregation in the **X-axis** to **Count** so that it contains the **Count of StockItemKey** field. Finally, resize the visualization in the report canvas to fill the available space.

        ![Screenshot of a Power BI report.](./images/fabric-report.png)

    > **Tip**: You can use the **>>** icons to hide the report designer panes in order to see the report more clearly.

1. On the **File** menu, select **Save** to save the report as **Brand Quantity Report** in your Fabric workspace.

    You can now close the browser tab contaning the report to return to your lakehouse. You can find the report in the page for your workspace in the Microsoft Fabric portal.

## Clean up resources

If you've finished exploring Microsoft Fabric, you can delete the workspace you created for this exercise.

1. In the bar on the left, select the icon for your workspace to view all of the items it contains.
2. In the **...** menu on the toolbar, select **Workspace settings**.
3. In the **Other** section, select **Remove this workspace**.

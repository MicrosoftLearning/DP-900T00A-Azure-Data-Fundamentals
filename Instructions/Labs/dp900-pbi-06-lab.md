---
lab:
  title: Explore fundamentals of data visualization with Power BI
  module: Explore fundamentals of data visualization
  description: In this lab, you'll import data from multiple sources into Power BI Desktop, build a simple data model, and create an interactive report with charts and a map. The lab is written for absolute beginners, so every step is explained in plain language.
  duration: 30 minutes
  level: 100
  islab: true
  primarytopics:
    - Power BI
---

# Explore fundamentals of data visualization with Power BI

**Power BI** is a Microsoft tool for turning raw data into charts, maps, and interactive reports, so you can see patterns and tell a story with your data instead of staring at rows of numbers.

In this lab, you'll use the free **Power BI Desktop** app to bring in some sample sales data (customers, products, and orders), connect those tables together into a simple **data model**, and then build a report with a table, charts, and a map that you can click to explore. Don't worry if you've never used Power BI before, every step is explained as you go.

This lab will take approximately **30** minutes to complete.

> **Note**: To complete this lab you'll need a Windows computer, as Power BI Desktop only runs on Windows.

## Install Power BI Desktop

If Microsoft Power BI Desktop is not already installed on your Windows computer, you can download and install it for free.

> _**What is Power BI Desktop?** It's the free app where you build your data models and reports on your own computer. Once a report is ready, you can optionally publish it to the Power BI service to share it with others._

1. Download the Power BI Desktop installer from [https://aka.ms/power-bi-desktop](https://aka.ms/power-bi-desktop?azure-portal=true).

1. When the file has downloaded, open it, and use the setup wizard to install Power BI Desktop on your computer. This installation may take a few minutes.

## Import data

1. Open Power BI Desktop. The application interface should look similar to this:

    ![Screenshot showing the Power BI Desktop start screen.](images/06-pbi-lab-power-bi-start.png)

    Now you're ready to import the data for your report.

1. On the Power BI Desktop welcome screen, select **Get data from other sources**, and then in the list of data sources, select **Web** and then select **Connect**.

    ![Screenshot showing how to select the web data source in Power BI.](images/06-pbi-lab-web-source.png)

1. In the **From web** dialog box, enter the following URL and then select **OK**:

    ```
    https://github.com/MicrosoftLearning/DP-900T00A-Azure-Data-Fundamentals/raw/master/power-bi/customers.csv
    ```

    > _**Tip**: Using the Web connector with sample CSV files means everyone works from the same clean data — no local files or credentials needed._

1. In the Access Web content dialog, select **Connect**.

1. Verify that the URL opens a dataset containing customer data, as shown below. Then select **Load** to load the data into the data model for your report.

    ![Screenshot showing a dataset of customer data displayed in Power BI.](images/06-pbi-lab-customers.png)

    > _**Tip**: Loading the data directly is fastest for this lab. You can always apply transformations later in Power Query if needed._

1. In the main Power BI Desktop window, in the Data menu, select **Get data**, then select **Web**:

    ![Screenshot showing the Get data menu in Power BI.](images/06-pbi-lab-get-data.png)

1. In the **From web** dialog box, enter the following URL and then select **OK**:

    ```
    https://github.com/MicrosoftLearning/DP-900T00A-Azure-Data-Fundamentals/raw/master/power-bi/products.csv
    ```

1. In the dialog, select **Load** to load the product data in this file into the data model.

1. Repeat the previous three steps to import a third dataset containing order data from the following URL:

    ```
    https://github.com/MicrosoftLearning/DP-900T00A-Azure-Data-Fundamentals/raw/master/power-bi/orders.csv
    ```

    > _**Tip**: Bringing in Customers, Products, and Orders creates a small, realistic model. Multiple related tables let you analyze across entities (for example, revenue by product category and city)._

## Explore a data model

The three tables of data you've imported have been loaded into a data model, which you'll now explore and refine.

> _**What is a data model?** It's the set of tables you bring into Power BI plus the connections between them. By linking the **customers**, **products**, and **orders** tables, Power BI can answer questions that span all three, such as "how much revenue did each product category earn in each city?"_
1. In Power BI Desktop, on the left-side edge, select the **Model** tab, and then arrange the tables in the model so you can see them. You can hide the panes on the right side by using the **>>** icons:

    ![Screenshot showing the Model tab in Power BI.](images/06-pbi-lab-model-tab.png)

1. In the **orders** table, select the **Revenue** field and then in the **Properties** pane, set its **Format** property to **Currency**:

    ![Screenshot showing how to set the Revenue format to Currency in Power BI.](images/06-pbi-lab-revenue-currency.png)

    This step will ensure that revenue values are displayed as currency in report visualizations.

    > _**Tip**: Formatting measures improves readability in visuals and aligns numbers with how business users expect to see them._

1. In the products table, right-click the **Category** field (or open its **&vellip;** menu) and select **Create hierarchy**. This step creates a hierarchy named **Category Hierarchy**. You may need to expand or scroll in the **products** table to see this - you can also see it in the **Fields** pane:

    ![Screenshot showing how to add the Category Hierarchy in Power BI.](images/06-pbi-lab-category-hierarchy.png)

1. In the products table, right-click the **ProductName** field (or open its **&vellip;** menu) and select **Add to hierarchy** > **Category Hierarchy**. This adds the **ProductName** field to the hierarchy you created previously.

    ![Screenshot showing how to add the prodcutname to Category Hierarchy in Power BI.](images/06-pbi-lab-add-category-hierarchy.png)

1. In the **Fields** pane, right-click **Category Hierarchy** (or open its **...** menu) and select **Rename**. Then rename the hierarchy to **Categorized Product**.

    ![Screenshot showing how to rename the hierarchy in Power BI.](images/06-pbi-lab-rename-hierarchy.png)

    > _**Tip**: A category→product hierarchy enables drill-down in visuals, so viewers can explore from summary to detail._

1. On the left-side edge, select the **Table view** tab, and then in the **Data** pane, select the **customers** table.

1. Select the **City** column header, and then set its **Data Category** property to **City**:

    ![Screenshot showing how to set a data category in Power BI.](images/06-pbi-lab-data-category.png)

    This step will ensure that the values in this column are interpreted as city names, which can be useful if you intend to include map visualizations.

    > _**Tip**: Data categories help Power BI geo-code locations correctly so map visuals place points in the right places._

## Create a report

Now you're almost ready to create a report. First you need to check some settings to ensure all visualizations are enabled.

1. On the **File** menu, select **Options and Settings**. Then select **Options**, and in the **Security** section, ensure that **Use Map and Filled Map visuals** is enabled and select **OK**.

    ![Screenshot showing how to set the Use Map and Filled Map visuals property in PowerBI.](images/06-pbi-lab-set-options.png)

    This setting ensures that you can include map visualizations in reports.

    > _**Tip**: Map visuals are turned off in some environments. Enabling them ensures the Map visual appears in your visualization pane._

1. On the left-side edge, select the **Report view** tab and view the report design interface.

    ![Screenshot showing the report tab in Power BI.](images/06-pbi-lab-report-tab.png)

1. In the ribbon, above the report design surface, select **Text Box** and add a text box containing the text **Sales Report** to the report. Format the text to make it bold with a font size of 32.

    ![Screenshot showing how to add a text box in Power BI.](images/06-pbi-lab-text-box.png)

    > _**Tip**: A clear title helps users understand the report’s purpose at a glance._

1. Select any empty area on the report to de-select the text box. Then in the **Data** pane, expand **Products** and select the **Categorized Products** field. This step adds a table to the report.

    ![Screenshot showing how to add a table of categorized products to a report in Power BI.](images/06-pbi-lab-categorized-products-table.png)

    > _**Tip**: Using the hierarchy field now lets you switch to visuals that support drill-down seamlessly._

1. With the table still selected, in the **Data** pane, expand **Orders** and select **Revenue**. A Revenue column is added to the table. You may need to expand the size of the table to see it.

    The revenue is formatted as currency, as you specified in the model. However, you didn't specify the number of decimal places, so the values include fractional amounts. It won't matter for the visualizations you're going to create, but you could go back to the **Model** or **Data** tab and change the decimal places if you wish.

    ![Screenshot showing a table of categorized products with revenue in a report.](images/06-pbi-lab-revenue-column.png)

1. With the table still selected, in the **Visualizations** pane, select the **Stacked column chart** visualization. The table is changed to a column chart showing revenue by category.

    ![Screenshot showing a stacked column chart of categorized products with revenue in a report.](images/06-pbi-lab-stacked-column-chart.png)

    > _**Tip**: A column chart makes it easy to compare categories side by side._

1. Above the selected column chart, select the **&#8595;** icon to turn on drill-down. Then in the chart, select any column to drill down and see the revenue for the individual products in this category. This capability is possible because you defined a hierarchy of categories and products.

    ![Screenshot showing a column chart drilled down to see products within a category.](images/06-pbi-lab-drill-down.png)

    > _**Tip**: Drill-down reveals detail on demand without cluttering the view — perfect for layered insights._

1. Use the **&#x2191;** icon to drill back up to the category level. Then select the **(**&#8595;**)** icon to turn off the drill-down feature.

1. Select a blank area of the report, and then in the **Data** pane, select the **Quantity** field in the **orders** table and the **Category** field in the **products** table. This step results in another column chart showing sales quantity by product category.

1. With the new column chart selected, in the **Visualizations** pane, select **Pie chart** and then resize the chart and position it next to the revenue by category column chart.

    ![Screenshot showing a pie chart that shows sales quantity by category.](images/06-pbi-lab-category-pie-chart.png)

    > _**Tip**: Showing quantity by category as a pie highlights proportional contribution, complementing the revenue column chart._

1. Select a blank area of the report, and then in the **Data** pane, select the **City** field in the **customers** table and then select the **Revenue** field in the **orders** table. This results in a map showing sales revenue by city. Rearrange and resize the visualizations as needed:

    ![Screenshot showing a map that shows revenue by city.](images/06-pbi-lab-revenue-map.png)

    > _**Tip**: Mapping revenue by city adds a geographic lens—patterns that aren’t obvious in tables or charts can pop on a map._

1. In the map, note that you can drag, double-click, use a mouse-wheel, or pinch and drag on a touch screen to interact. Then select a specific city, and note that the other visualizations in the report are modified to highlight the data for the selected city.

    ![Screenshot showing a map that shows revenue by city highlighting data for the selected city.](images/06-pbi-lab-selected-data.png)

    > _**Tip**: Cross-highlighting lets users interact with one visual and see related changes across the page—turning a static report into an interactive experience._

1. On the **File** menu, select **Save**. Then save the file with an appropriate .pbix file name. You can open the file and explore data modeling and visualization further at your leisure.

    > _**Tip**: Saving a .pbix keeps your model, queries, and report together so you can reopen and iterate later._

If you've a [Power BI service](https://www.powerbi.com/?azure-portal=true) subscription, you can sign into your account and publish the report to a Power BI workspace. 

> **Tip**: Publishing to the Power BI service lets you share the report, schedule refresh, and collaborate with others in your workspace.

## Clean up

Unlike the other labs in this course, this exercise didn't create any paid Azure resources, so there's nothing to delete or switch off. The report you built is saved as a `.pbix` file on your own computer.

In this lab, you imported data from multiple sources into Power BI Desktop, connected it into a simple data model, and built an interactive report with a table, charts, and a map. You've taken your first steps with turning raw data into visual insights!

---
title: Online Hosted Instructions
permalink: index.html
layout: home
---

# Azure Data Fundamentals Exercises

These hands-on exercises are designed to support training content on [Microsoft Learn](https://docs.microsoft.com/training/).

To complete these exercises, you'll need a Microsoft Azure subscription in which you have administrative permisssions. You can sign up for a free trial at [https://azure.microsoft.com](https://azure.microsoft.com).

{% assign labs = site.pages | where_exp:"page", "page.url contains '/Instructions/Labs'" %}
| Exercise |
| --- |
{% for activity in labs  %}| [{{ activity.lab.title }}{% if activity.lab.type %} - {{ activity.lab.type }}{% endif %}]({{ site.github.url }}{{ activity.url }}) |
{% endfor %}

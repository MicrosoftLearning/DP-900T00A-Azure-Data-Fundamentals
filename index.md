---
title: Online Hosted Instructions
permalink: index.html
layout: home
---

# Azure Data Fundamentals Exercises

Use the links below to complete the hands-on lab exercises for Microsoft course [DP-900 *Microsoft Azure Data Fundamentals*](https://docs.microsoft.com/learn/certifications/courses/dp-900t00).

To complete these exercises, you'll need a Microsoft Azure subscription. If your instructor has not provided you with one, you can sign up for a free trial at [https://azure.microsoft.com](https://azure.microsoft.com).

{% assign labs = site.pages | where_exp:"page", "page.url contains '/Instructions/Labs'" %}
| Module | Lab |
| --- | --- | 
{% for activity in labs  %}| {{ activity.lab.module }} | [{{ activity.lab.title }}{% if activity.lab.type %} - {{ activity.lab.type }}{% endif %}]({{ site.github.url }}{{ activity.url }}) |
{% endfor %}

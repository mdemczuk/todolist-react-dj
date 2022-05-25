from django.db import models

class Employee(models.Model):
    first_name = models.TextField(max_length=30)
    last_name = models.TextField(max_length=50)
    email = models.TextField(max_length=100)
    mobile = models.TextField(max_length=12)
    employment_date = models.DateField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"



class Task(models.Model):
    class Category(models.TextChoices):
        CATEGORY1 = "Category1"
        CATEGORY2 = "Category2"
        CATEGORY3 = "Category3"
        CATEGORY4 = "Category4"
    
    class Status(models.TextChoices):
        STATUS1 = "To do"
        STATUS2 = "In progress"
        STATUS3 = "Done"

    description = models.TextField(max_length=400)
    status = models.TextField(choices=Status.choices)
    category = models.TextField(choices=Category.choices)
    due_date = models.DateField()
    owner = models.ForeignKey(Employee, on_delete=models.CASCADE)

    def __str__(self):
        return f"Task {self.id}"


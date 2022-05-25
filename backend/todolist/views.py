import codecs
import datetime
import csv
from django.core.exceptions import PermissionDenied
from django.http import Http404, HttpResponse
from django.shortcuts import render
from rest_framework import routers, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from todolist.models import Employee, Task
from todolist.serializers import EmployeeSerializer, TaskSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    authentication_classes = ()

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    authentication_classes = ()

router = routers.SimpleRouter()
router.register(r'employee', EmployeeViewSet)
router.register(r'task', TaskViewSet)


@api_view()
def task_by_owner(request):
    if "owner_id" not in request.query_params:
        raise PermissionDenied()
   
    tasks = Task.objects.filter(owner=request.query_params["owner_id"])    
    return Response([TaskSerializer(each).data for each in tasks])

@api_view()
def tasks_today(request):
    current_date = datetime.date.today()
    tasks = Task.objects.filter(due_date=current_date)
    employees_today = {}
    for each in tasks:
        owner = Employee.objects.get(id=each.owner_id)
        if owner in employees_today:
            employees_today[owner].append(TaskSerializer(each).data)
        else:
            employees_today[owner] = [TaskSerializer(each).data]

    results = []
    for key, value in employees_today.items():
        serialized_owner = EmployeeSerializer(key).data
        serialized_owner['tasks'] = value
        results.append(serialized_owner)

    return Response(results)


def csv_export(request):
    if "owner_id" not in request.GET:
        raise PermissionDenied()
   
    tasks = Task.objects.filter(owner=request.GET["owner_id"])
    owner = Employee.objects.get(id=request.GET["owner_id"])
    response = HttpResponse(
        content_type='text/csv',
        headers={'Content-Disposition': f'attachment; filename="{owner.first_name}{owner.last_name}Tasks.csv"'},
    )

    response.write(codecs.BOM_UTF8)
    writer = csv.writer(response)
    writer.writerow(['description', 'status', 'category', 'due_date'])
    for each in tasks:
        writer.writerow([f'{each.description}', f'{each.status}', f'{each.category}', f'{each.due_date}'])

    return response
from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("getQuestion/", views.getQuestion, name="getQuestion"),
    path("test", views.test, name="test"),
    path("register", views.register, name="register"),
    path("login", views.loginPage, name="login"),
    path("logout", views.logoutPage, name="logout")
]
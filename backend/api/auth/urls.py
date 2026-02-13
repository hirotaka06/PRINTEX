from django.urls import path
from api.auth.views.login_view import LoginView
from api.auth.views.logout_view import LogoutView
from api.auth.views.user_view import CurrentUserView

urlpatterns = [
    path("login/", LoginView.as_view(), name="auth-login"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("user/", CurrentUserView.as_view(), name="auth-user"),
]

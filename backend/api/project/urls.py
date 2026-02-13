from django.urls import path
from api.project.views.project_view import (
    ProjectListView,
    ProjectCreateView,
    ProjectRetrieveView,
    ProjectRestoreView,
    ProjectTrashListView,
    ProjectPermanentDeleteView,
)
from api.project.views.version_history_view import (
    ProblemLatexHistoryView,
    ExplanationHistoryView,
    ProblemLatexConfirmView,
    ExplanationConfirmView,
)

urlpatterns = [
    path("", ProjectListView.as_view(), name="project-list"),
    path("create/", ProjectCreateView.as_view(), name="project-create"),
    path("trash/", ProjectTrashListView.as_view(), name="project-trash-list"),
    path("<uuid:pk>/restore/", ProjectRestoreView.as_view(), name="project-restore"),
    path("<uuid:pk>/permanent/", ProjectPermanentDeleteView.as_view(), name="project-permanent-delete"),
    path("<uuid:pk>/latex/history/", ProblemLatexHistoryView.as_view(), name="problem-latex-history"),
    path("<uuid:pk>/latex/<int:version>/confirm/", ProblemLatexConfirmView.as_view(), name="problem-latex-confirm"),
    path("<uuid:pk>/explanation/history/", ExplanationHistoryView.as_view(), name="explanation-history"),
    path("<uuid:pk>/explanation/<int:version>/confirm/", ExplanationConfirmView.as_view(), name="explanation-confirm"),
    path("<uuid:pk>/", ProjectRetrieveView.as_view(), name="project-retrieve"),
]

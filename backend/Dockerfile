FROM python:3.12-slim

WORKDIR /app

# Install dependencies from pyproject.toml
COPY pyproject.toml ./
RUN pip install --no-cache-dir .

# Copy application code
COPY config/ config/
COPY core/ core/
COPY accounts/ accounts/
COPY notes/ notes/
COPY manage.py ./

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

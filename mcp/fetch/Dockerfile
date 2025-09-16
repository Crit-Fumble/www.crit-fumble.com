FROM python:3.12-slim

# Install curl and other dependencies
RUN apt-get update && apt-get install -y curl

# Install uv
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# Add uv to PATH and install packages
ENV PATH="/root/.cargo/bin:${PATH}"
RUN uv pip install uvx

WORKDIR /workspace

COPY main.py .

ENTRYPOINT ["uvx", "main.py"]
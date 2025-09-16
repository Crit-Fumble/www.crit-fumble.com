#!/bin/bash

# Crit-Fumble Development Database Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Start the database
start_db() {
    log_info "Starting PostgreSQL database..."
    docker-compose up -d postgres
    
    # Wait for database to be ready
    log_info "Waiting for database to be ready..."
    timeout 60 bash -c 'until docker-compose exec postgres pg_isready -U postgres -d crit_fumble; do sleep 2; done'
    
    log_info "Database is ready!"
}

# Stop the database
stop_db() {
    log_info "Stopping PostgreSQL database..."
    docker-compose down
}

# Reset the database (remove all data)
reset_db() {
    log_warn "This will delete all database data. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        log_info "Stopping database and removing data..."
        docker-compose down -v
        log_info "Database reset complete."
    else
        log_info "Database reset cancelled."
    fi
}

# Run database migrations
migrate_db() {
    log_info "Running database migrations..."
    cd packages/core
    cp ../../.env.dev ../../.env
    npm run migrate
    cd ../..
}

# Generate Prisma client
generate_client() {
    log_info "Generating Prisma client..."
    cd packages/core
    cp ../../.env.dev ../../.env
    npm run generate
    cd ../..
}

# Setup complete development environment
setup_dev() {
    log_info "Setting up development environment..."
    
    # Copy dev environment file
    cp .env.dev .env
    log_info "Environment file created"
    
    # Start database
    start_db
    
    # Generate Prisma client
    generate_client
    
    # Run migrations
    migrate_db
    
    log_info "Development environment setup complete!"
    log_info "Database is running on localhost:5432"
    log_info "Database name: crit_fumble"
    log_info "Username: postgres"
    log_info "Password: dev_password_123"
}

# Show help
show_help() {
    echo "Crit-Fumble Development Database Management"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  setup     - Setup complete development environment"
    echo "  start     - Start the database"
    echo "  stop      - Stop the database"
    echo "  reset     - Reset the database (removes all data)"
    echo "  migrate   - Run database migrations"
    echo "  generate  - Generate Prisma client"
    echo "  help      - Show this help message"
    echo ""
}

# Main script logic
case "${1:-help}" in
    setup)
        check_docker
        setup_dev
        ;;
    start)
        check_docker
        start_db
        ;;
    stop)
        check_docker
        stop_db
        ;;
    reset)
        check_docker
        reset_db
        ;;
    migrate)
        migrate_db
        ;;
    generate)
        generate_client
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
# Use the official Go image as the builder
FROM golang:1.22-alpine

# Set the working directory
WORKDIR /app

# Copy go modules & dependencies first
COPY go.mod .
COPY /web/main.go ./
RUN go mod download

# Copy the rest of the code
COPY . .
COPY .env .

# Build the Go application (adjust to include the 'web' directory)
RUN go build -o main .

ENTRYPOINT [ "/app/main" ]

# Use the official Go image as the builder (multi-stage build)
FROM golang:1.22-alpine AS builder

# Set the working enviroment
WORKDIR /src/app

# Copy the go.mod and go.sum first to leverage Docker cache
COPY go.mod go.sum ./

# Copy the source code
COPY . .

# Build the Go application (adjust to include the 'web' directory if necessary)
RUN go build -o main ./web

# Use a small iamge to run the application
FROM alpine:latest

# Set the working directory for the app
WORKDIR /src/app

# Copy the complied Go binary from the builder stage
COPY --from=builder /src/app/main .

# Copy enviroment variables or config files if needed
COPY .env ./

# Expose the port the app is running
EXPOSE 8000

# Run the Go application
ENTRYPOINT [ "/src/app/main" ]
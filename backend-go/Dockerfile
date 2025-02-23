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
all:
	docker buildx build --platform linux/amd64 -t finleyge/homesite:latest .

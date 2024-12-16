build:
	docker build -t polo15s/product_demo:V0.1.0 .
run:
	docker run -d -p 5005:5005 polo15s/product_demo:V0.1.0

complier = gcc
includes = $(shell find ./ -name "*.h")
sources = $(shell find ./ -name "*.c")
objects = $(sources:%.c=%.o)
program = server

$(program): $(objects)
	$(complier) -o $(program) $(objects)

%.o: %.c $(includes)
	$(complier) -c $< -o $@

clean:
	$(objects)
	rm -rf $(objects)

clean-all: 
	rm -rf $(objects) $(program)

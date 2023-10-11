export const load = () => {
	const comment = `# De # aan het begin van deze regel geeft aan dat dit een comment is.
# Comments worden niet uitgevoerd wanneer we een script runnen.
# Ze zijn wel heel handig voor onszelf om aan te geven waarom we iets hebben gedaan!`
	const helloworld = `# Dit is de print functie, deze kan infomatie weergeven en een venster wat wij de console noemen.
print("hello world!")`
	const printx = `x = 42
print(x)`
	const addition = `x = x + 1`
	const loop = `# Dit script gebruikt een for loop om 1 tot en met 10 te printen.
for i in range(0, 10):
    # Alles wat op deze indentatie staat valt in de for loop.
    p = i + 1
    print(p)

# Zodra er weer iets zonder extra indentatie staat valt het buiten de for loop.
print("buiten de for loop")`
	const func = `# Het keyword def geeft aan dat we een eigen functie maken
# tussen de haakjes staat world, dit is een variabel die we mee kunnen geven die in de functie gebruikt kan worden.
def hello_world(world):
print("hello world:", world, "!")

hello_world("aarde")`
	const prototype = `# key is de key die we ook in het eerdere voorbeel hebben gebruikt.
def put_pixel(x, y, color, key)

# len is het aantal pixels dat de lijn lang is.
def create_horizontal_line(x, y, color, len, key)`
	return {
		comment,
		helloworld,
		printx,
		addition,
		loop,
		func,
		prototype
	}
}

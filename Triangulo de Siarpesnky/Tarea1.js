class Punto 
{
    constructor(x, y) 
    {
      this.x = x;
      this.y = y;
    }

    //Funcion que sirve para crear un punto medio entre ambos puntos
    static puntoMedio(x, y)
    {
        return new Punto((x.x + y.x) / 2, (x.y + y.y) / 2);
    }
}

//Funcion recursiva 
function sierpinski(x, y, z, subdivisiones, triangulo)
{
    //Este es el caso base 
    if(subdivisiones == 0)
    {
        triangulo.fillStyle = triangulo.fillStyle = 'rgba(200, 50, 100, 1.0)';
        triangulo.beginPath(); 
        triangulo.moveTo(x.x, x.y); 
        triangulo.lineTo(y.x, y.y);
        triangulo.lineTo(z.x, z.y);
        triangulo.fill();
    }
    //Usando recursividad creamos las subdiviciones les triangulo
    else
    {
        let puntoMedio1 = Punto.puntoMedio(x, y);
        let  puntoMedio2 = Punto.puntoMedio(y, z);
        let puntoMedio3 = Punto.puntoMedio(z, x);
        sierpinski(x, puntoMedio1, puntoMedio3, subdivisiones - 1, triangulo);
        sierpinski(puntoMedio1, y, puntoMedio2, subdivisiones - 1, triangulo);
        sierpinski(puntoMedio3, puntoMedio2, z, subdivisiones - 1, triangulo);
    }
}

function sliderEvent()
{
    document.getElementById("slider").oninput = function(event) 
    {
        let canvas = document.getElementById("htmlCanvas");
        if(!canvas)
        {
            console.log("Failed to load the canvas element.")
            return;
        }
        let ctx = canvas.getContext("2d")

        //Limpiamos el Canvas por si disminuimos la subdivisones
        ctx.clearRect(0, 0, 600, 600);

        //Actualizamos el canvas con los nuevos valores
        document.getElementById("sliderValue").innerHTML = "Subdivisions: " + event.target.value;
        sierpinski(new Punto(0, 600), new Punto(600, 600), new Punto(300, 0), event.target.value, ctx)
    };
}



function main()
{
    let canvas = document.getElementById("htmlCanvas");
    if(!canvas)
    {
        console.log("Failed to load the canvas element.")
        return;
    }
    let ctx = canvas.getContext("2d");

    sliderEvent();

    //Llamamos la funcion sierpisky para crear nuestro triangulo
    sierpinski(new Punto(0, 600), new Punto(600, 600), new Punto(300, 0), 0, ctx)
}
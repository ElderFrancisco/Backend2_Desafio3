const fs = require('fs');

class ProductManager {
  constructor(archivo) {
    this.path = archivo;
    this.automaticId = 1;
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.productos = JSON.parse(data);
      const maxId = Math.max(...this.productos.map((prod) => prod.id), 0);
      this.automaticId = maxId + 1;
    } catch (error) {
      console.error('Error al leer el archivo:', error);
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      const existCode = this.productos.find((prod) => prod.code === code);
      if (existCode) {
        console.log(
          `El código ${code} coincide con el código ya existente de ${existCode.title}, para agregar el producto debera cambiar su code:${code}`,
        );
      }

      const existId = this.productos.find(
        (prod) => prod.id === this.automaticId,
      );
      if (existId) {
        console.log(
          `El id ${this.automaticId} ya está en uso, no se puede agregar el producto`,
        );
      }
      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !stock ||
        existCode ||
        existId
      ) {
        console.log(
          `Por favor complete todos los campos solicitados de ${title}`,
        );
      } else {
        const product = {
          id: this.automaticId++,
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };
        this.productos.push(product);
        console.log(`El producto ${title} fue agregado correctamente`);
        let text = JSON.stringify(this.productos, null, 2);
        fs.writeFileSync(this.path, text, (error) =>
          console.log(`error al escribir addProduct ${error}`),
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts() {
    try {
      if (this.productos.length === 0) {
        console.log('No hay productos disponibles');
      } else {
        console.log('Productos disponibles');
        this.productos.forEach((product) => {
          console.log(product);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const productExistent = this.productos.find((prod) => prod.id === id);
      if (!productExistent) {
        console.log(`Not found: el producto con el id ${id} no fue encontrado`);
      } else {
        console.log(`El producto con el id ${id} fue encontrado`);
        console.log(productExistent);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, fieldToUpdate, newValue) {
    try {
      const product = this.productos.find((prod) => prod.id === id);
      if (!product) {
        console.log('El producto no fue encontrado');
      }
      product[fieldToUpdate] = newValue;
      fs.writeFile(
        this.path,
        JSON.stringify(this.productos, null, 2),
        (error) => {
          if (error) {
            console.log('Error al guardar los cambios en el archivo');
          } else {
            console.log('El producto fue actualizado correctamente');
          }
        },
      );
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      const index = this.productos.findIndex((prod) => prod.id === id);

      if (index === -1) {
        console.log(`No se encontro ningún elemento con el id ${id}`);
        return;
      } else {
        console.log('El elemento del archivo se eliminó correctamente');
      }
      this.productos.splice(index, 1);
      fs.readFile(this.path, 'utf-8', (error, data) => {
        if (error) {
          console.log('Ocurrió un error al leer el archivo' + error);
        }
        let productsData = JSON.parse(data);
        productsData = this.productos;
        const contenidoActualizado = JSON.stringify(productsData, null, 2);
        fs.writeFile(this.path, contenidoActualizado, (error) => {
          if (error) {
            console.log('Hubo un error al actualizar el archivo');
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
}

//
//
//
//
//
//
//

(async () => {
  try {
    let test = new ProductManager('productos.txt');
    console.log(test.getProducts());
    await test.addProduct(
      'chocolate dulce',
      'chocolate dulce a base de cacao',
      200,
      'Sin imagen',
      'dulce',
      25,
    );
    await test.addProduct(
      'chocolate amargo',
      'chocolate amargo a base de cacao',
      200,
      'Sin imagen',
      'amargo',
      25,
    );
    await test.addProduct(
      'chocolate blanco',
      'chocolate blanco a base de cacao',
      200,
      'Sin imagen',
      'blanco',
      25,
    );
    await test.addProduct(
      'chocolate MARRON',
      'chocolate MARRON a base de cacao',
      214,
      'Sin imagen',
      'blanco',
      26,
    );
    console.log(test.getProducts());
    await test.getProductById(2);
    await test.getProductById(5);
    await test.updateProduct(2, 'price', 500);
    await test.deleteProduct(3);
    await test.deleteProduct(5);

    await test.addProduct(
      'chocolate violeta',
      'chocolate violeta a base de cacao',
      200,
      'hrrpstasd:sdaw',
      'violeta',
      25,
    );
  } catch (error) {
    console.log(error);
  }
})();

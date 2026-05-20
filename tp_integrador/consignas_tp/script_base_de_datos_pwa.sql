CREATE pwa_integrador;
USE pwa_integrador;
-- tabla temporal con CSV crudo
CREATE TABLE productos_raw (
  product_name TEXT,
  description TEXT,
  initial_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  currency VARCHAR(10),
  in_stock VARCHAR(10),
  color VARCHAR(50),
  size VARCHAR(50),
  reviews_count INT,
  main_image TEXT,
  category_url TEXT,
  url TEXT,
  category_tree TEXT,
  country_code VARCHAR(10),
  domain VARCHAR(50),
  image_count INT,
  image_urls TEXT,
  model_number TEXT,
  offers TEXT,
  other_attributes TEXT,
  product_id VARCHAR(100),
  rating DECIMAL(3,2),
  related_products TEXT,
  root_category TEXT,
  top_reviews TEXT,
  category VARCHAR(255),
  brand VARCHAR(255),
  all_available_sizes TEXT
);

LOAD DATA LOCAL INFILE 'shein-products.csv'
INTO TABLE productos_raw
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(1050),
  descripcion TEXT,
  precio DECIMAL(10,2),
  imagen VARCHAR(500),
  categoria_id INT,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- insertar categorias únicas
INSERT INTO categorias (nombre)
SELECT DISTINCT TRIM(category)
FROM productos_raw
WHERE category IS NOT NULL AND category != '';

ALTER TABLE productos 
MODIFY nombre VARCHAR(1500);

INSERT INTO productos (nombre, descripcion, precio, imagen, categoria_id)
SELECT 
  TRIM(product_name),
  TRIM(description),
  final_price,
  main_image,
  c.id
FROM productos_raw p
JOIN categorias c ON TRIM(p.category) = c.nombre
WHERE final_price IS NOT NULL;
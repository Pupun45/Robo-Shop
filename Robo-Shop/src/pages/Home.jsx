import { Link } from "react-router-dom";
import React, { useRef } from "react";
import Carousel from 'react-bootstrap/Carousel';
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import banner1 from '../assets/banner4.jpg';
import banner2 from '../assets/banner2.jpg';
import banner3 from '../assets/banner3.png'
import "../App.css"
import CardCarousel from '../Extra-Thing/ShopCard'
import HC from '../assets/HC.jpeg';
import IR from '../assets/IR_sensor_Module.webp';
import TH from '../assets/images.jpeg';
import IOTaso from '../assets/IOTAso.jpg'
import Audino from '../assets/Arduino.jpg'
import Esp32 from '../assets/esp32.jpg'
import Buzzer from '../assets/buzzer.jpg'
import Scrollbtn from '../Extra-Thing/ScrollButtons'

const demoProducts = [
  { name: 'Ultrasonic Sensor', price: 59, image: HC },
  { name: 'IR Sensor Module', price: 28, image: IR },
  { name: 'Humidity Sensor', price: 85, image: TH },
  { name: 'More Sensor', price: 99, image: HC },
  { name: 'Extra Sensor', price: 199, image: IR },
  { name: 'Ultrasonic Sensor', price: 59, image: HC },
  { name: 'IR Sensor Module', price: 28, image: IR },
  { name: 'Humidity Sensor', price: 85, image: TH },
];

//card section

const products = [
  {
    id: 1,
    name: "HTC 830L+ Digital Multimeter",
    sku: "1008697",
    price: "₹645.00",
    image: HC,
    rating: 4.5,
    reviews: 24,
  },
  {
    id: 2,
    name: "UNI-T UT33A+ Multimeter",
    sku: "1008698",
    price: "₹720.00",
    image: IR,
    rating: 4,
    reviews: 18,
  },
  {
    id: 3,
    name: "Mastech MS8229 Multimeter",
    sku: "1008699",
    price: "₹1,299.00",
    image: TH,
    rating: 4.8,
    reviews: 40,
  },
  {
    id: 4,
    name: "Mextech DT-603 Multimeter",
    sku: "1008700",
    price: "₹550.00",
    image: Esp32,
    rating: 4.2,
    reviews: 30,
  },
  {
    id: 5,
    name: "Mextech DT-603 Multimeter",
    sku: "1008700",
    price: "₹550.00",
    image: Buzzer,
    rating: 4.2,
    reviews: 30,
  },

];
//image crousel
const images = [
  HC, IR, Audino, Buzzer, IOTaso, TH, HC, IR, Audino, Buzzer, IOTaso, TH,
];
// Clean price remove ₹, commas, /-, whitespace etc.
const cleanPrice = (price) => {
  if (!price) return 0;
  return Number(price.toString().replace(/[^0-9.]/g, ""));
};

const Home = () => {
  //image crousel

  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const navigate = useNavigate();

  // Example product data (can be later fetched from API)
  const products = [
    {
      id: 1,
      name: "Esp32",
      sku: "1008697",
      rating: 4.5,
      reviews: 12,
      price: "₹645.00",
      image: Esp32,
    },
    {
      id: 2,
      name: "Buzzer",
      sku: "1002345",
      rating: 4,
      reviews: 8,
      price: "₹499.00",
      image: Buzzer,
    },
    {
      id: 3,
      name: "Humidity Senson",
      sku: "1003321",
      rating: 5,
      reviews: 22,
      price: "₹100",
      image: TH,
    },
    {
      id: 3,
      name: "IR sensor Module",
      sku: "1003321",
      rating: 5,
      reviews: 22,
      price: "₹299.00",
      image: IR,
    },
    {
      id: 3,
      name: "Arduino Uno R3 Board",
      sku: "1003321",
      rating: 5,
      reviews: 22,
      price: "₹1,299.00",
      image: Audino,
    },
  ];

  // Function to add product to cart
  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart, product];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`${product.name}Product added to cart!`);
    navigate("/carts");
  };
  const scrollAddToCart = (product) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...storedCart, product];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`${product.name} added to cart!`);
  };
  // Add to Wishlist
  const handleAddToWishlist = (product) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (!product.id) {
      alert("Product is missing an ID!");
      return;
    }
    if (!wishlist.some(item => item.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert(`${product.name} added to wishlist!`);
    } else {
      alert(`${product.name} is already in your wishlist!`);
    }
  };


  return (
    <div>
   <div>
  <Scrollbtn />
  <Carousel data-bs-theme="dark">
    <Carousel.Item>
      <img
        className="d-block w-100 carousel-img"
        src={banner1}
        alt="First slide"
      />
      <Carousel.Caption>
        <h5>First slide label</h5>
        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
      </Carousel.Caption>
    </Carousel.Item>

    <Carousel.Item>
      <img
        className="d-block w-100 carousel-img"
        src={banner2}
        alt="Second slide"
      />
      <Carousel.Caption>
        <h5>Second slide label</h5>
        <p>Lorem ipsum dolor sit amet.</p>
      </Carousel.Caption>
    </Carousel.Item>

    <Carousel.Item>
      <img
        className="d-block w-100 carousel-img"
        src={banner3}
        alt="Third slide"
      />
      <Carousel.Caption>
        <h5>Third slide label</h5>
        <p>Praesent commodo cursus magna.</p>
      </Carousel.Caption>
    </Carousel.Item>
  </Carousel>
</div>

      <>
        <div className="offer-section">
          <div className="offer-card">
            <h3>IOT Accessories</h3>
            <img
              src={IOTaso}
              alt="..."
              className="single-img"
            />
            <Link to="/shop" style={{ color: "#007185" }}>
              <p>See all deals</p></Link>
          </div>

          <div className="offer-card">
            <h3>Assosories & more</h3>
            <div className="grid-2">
              <div>
                <img
                  src={Audino}
                  alt=".."
                />
                <p>Audino</p>
              </div>
              <div>
                <img
                  src={Esp32}
                  alt="..."
                />
                <p>Esp 32</p>
              </div>
              <div>
                <img
                  src={Esp32}
                  alt="..."
                />
                <p>Esp 32</p>
              </div>
              <div>
                <img
                  src={Buzzer}
                  alt="..."
                />
                <p>Buzzer</p>
              </div>
            </div>
            <Link to="/shop" style={{ color: "#007185" }}>
              <p>See all deals</p></Link>
          </div>

          <div className="offer-card">
            <h3>Listed IOT Product</h3>
            <div className="grid-2">
              <div>
                <img
                  src={Buzzer}
                  alt="..."
                />
                <p>Soil Monitor</p>
              </div>
              <div>
                <img
                  src={HC}
                  alt="..."
                />
                <p>Iot based smart Fountain</p>
              </div>
              <div>
                <img
                  src={Esp32}
                  alt="..."
                />
                <p>Smart Dustbin</p>
              </div>
              <div>
                <img
                  src={HC}
                  alt="..."
                />
                <p>Home-Automation</p>
              </div>
            </div>
            <Link to="/project" style={{ color: "#007185" }}>
              <p>See all deals</p></Link>
          </div>

          <div className="offer-card">
            <h3>Top Listed Product</h3>
            <div className="grid-2">
              <div>
                <img
                  src={TH}
                  alt="..."
                />
                <p>Home appliances</p>
              </div>
              <div>
                <img
                  src={Buzzer}
                  alt="..."
                />
                <p>Electronics</p>
              </div>
              <div>
                <img
                  src={Esp32}
                  alt="..."
                />
                <p>Furniture & decors</p>
              </div>
              <div>
                <img
                  src={IOTaso}
                  alt="..."
                />
                <p>For Business purchases</p>
              </div>
            </div>
            <Link to="/shop" style={{ color: "#007185" }}>
              <p>See all deals</p></Link>
          </div>
        </div>
        <div className="Text-size">
          <h3 className="hd" data-title="Featured Products">
            Featured Products
          </h3>
          <div className="sep"></div>
          <div className="sep2"></div>
        </div>
      </>
      <>
        <CardCarousel items={demoProducts} />
      </>
      <>
        <div className="Text-size">
          <h3 className="hd" data-title=" Top Rated Project">
            Top Rated Product
          </h3>
          <div className="sep"></div>
          <div className="sep2"></div>
        </div>
      </>
      <div className="card-container">
        {products.map((product) => (
          <div className="card-item" key={product.id}>
            <div
              className="Shop-wishlist-icon"
              onClick={() => handleAddToWishlist(product)}
            >
              ❤️
            </div>
            <img src={product.image} alt={product.name} className="card-image" />
            <h3 className="card-title">{product.name}</h3>

            <p className="card-sku">
              <strong>SKU:</strong> {product.sku}
            </p>

            <div className="card-rating">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  color={i < Math.round(product.rating) ? "#ffc107" : "#ddd"}
                />
              ))}
              <span className="card-reviews">({product.reviews})</span>
            </div>

            <div className="card-price">
              <span>{product.price}</span> <small>(Incl. GST)</small>
            </div>

            <button
              className="scroll-cart-btn"
              onClick={() => handleAddToCart(product)}
            >
              <FaShoppingCart />
            </button>
          </div>
        ))}
      </div>
      <>
        <div className="Text-size">
          <h3 className="hd" data-title=" Bestseller">
            Bestseller
          </h3>
          <div className="sep"></div>
          <div className="sep2"></div>
        </div>
        <div className="carousel-wrapper">
          <button className="nav-btn left" onClick={scrollLeft}>
            &#10094;
          </button>
          <div className="image-row-carousel" ref={carouselRef}>
            {images.map((img, index) => (
              <div className="image-card" key={index}>
                <img src={img} alt={`img-${index}`} />
              </div>
            ))}
          </div>
          <button className="nav-btn right" onClick={scrollRight}>
            &#10095;
          </button>
        </div>
      </>
      <>
        <div className="Text-size">
          <h3 className="hd" data-title="10% Discount Now">
            10% Discount Now
          </h3>
          <div className="sep"></div>
          <div className="sep2"></div>
        </div>
        <>
          <div className="offer-section">
            <div className="offer-card-2nd">
              <h3>IOT Accessories</h3>
              <img
                src={IOTaso}
                alt="..."
                className="single-img"
              />
              <Link to="/shop" style={{ color: "#007185" }}>
                <p>See all deals</p></Link>
            </div>

            <div className="offer-card-2nd">
              <h3>Assosories & more</h3>
              <div className="grid-2">
                <div>
                  <img
                    src={Audino}
                    alt="..."
                  />
                  <p>Audino</p>
                </div>
                <div>
                  <img
                    src={Esp32}
                    alt="..."
                  />
                  <p>Esp 32</p>
                </div>
                <div>
                  <img
                    src={Esp32}
                    alt="..."
                  />
                  <p>Esp 32</p>
                </div>
                <div>
                  <img
                    src={Buzzer}
                    alt="..."
                  />
                  <p>Buzzer</p>
                </div>
              </div>
              <Link to="/shop" style={{ color: "#007185" }}>
                <p>See all deals</p></Link>
            </div>

            <div className="offer-card-2nd">
              <h3>IoT based Project</h3>
              <div className="grid-2">
                <div>
                  <img
                    src={Esp32}
                    alt="..."
                  />
                  <p>Soil Monitor</p>
                </div>
                <div>
                  <img
                    src={Esp32}
                    alt="..."
                  />
                  <p>Iot based smart Fountain</p>
                </div>
                <div>
                  <img
                    src={HC}
                    alt="..."
                  />
                  <p>Smart Dustbin</p>
                </div>
                <div>
                  <img
                    src={Buzzer}
                    alt="..."
                  />
                  <p>Home-Automation</p>
                </div>
              </div>
              <Link to="/project" style={{ color: "#007185" }}>
                <p>See all deals</p></Link>
            </div>

            <div className="offer-card-2nd">
              <div className="grid-2">
                <div>
                  <img
                    src={TH}
                    alt="..."
                  />
                  <p>Home appliances</p>
                </div>
                <div>
                  <img
                    src={HC}
                    alt="..."
                  />
                  <p>Electronics</p>
                </div>
                <div>
                  <img
                    src={Buzzer}
                    alt="..."
                  />
                  <p>Furniture & decors</p>
                </div>
                <div>
                  <img
                    src={Audino}
                    alt="..."
                  />
                  <p>For Business purchases</p>
                </div>
              </div>
              <Link to="/project" style={{ color: "#007185" }}>
                <p>See all deals</p></Link>
            </div>
          </div>
        </>
      </>
    <>
  <div className="Text-size">
    <h3 className="hd" data-title="Featured Products">
      Featured Products
    </h3>
    <div className="sep"></div>
    <div className="sep2"></div>
  </div>

  <div className="scroll-container">
    <div className="scroll-content">
      {[...products, ...products, ...products].map((product, i) => (
        <div className="scroll-card" key={i}>
          <div
            className="Shop-wishlist-icon"
            onClick={() => handleAddToWishlist(product)}
          >
            ❤️
          </div>

          <img
            src={product.image}
            alt={product.name}
            className="scroll-image"
          />

          <h3 className="scroll-title">{product.name}</h3>

          <p className="scroll-sku">
            <strong>SKU:</strong> {product.sku}
          </p>

          <div className="scroll-rating">
            {[...Array(5)].map((_, j) => (
              <FaStar
                key={j}
                color={j < Math.round(product.rating) ? "#ffc107" : "#ddd"}
              />
            ))}
            <span className="scroll-reviews">({product.reviews})</span>
          </div>

          <div className="scroll-price">
            <span>₹{cleanPrice(product.price)}</span> <small>(Incl. GST)</small>
          </div>

          <button
            className="scroll-cart-btn"
            onClick={() => scrollAddToCart(product)}
          >
            <FaShoppingCart />
          </button>

        </div>
      ))}
    </div>
  </div>
</>

    </div>
  );
};

export default Home;

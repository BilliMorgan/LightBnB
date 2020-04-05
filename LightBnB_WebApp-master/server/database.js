const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg')

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function (email) {
  return pool.query(`
  SELECT *
  FROM users
  WHERE email = $1
  `, [email])
    .then(res => {
      return res.rows[0]
    })
    .catch(err => console.error('query error', err.stack));

}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithId = function (id) {
  return pool.query(`
  SELECT * 
  FROM users
  WHERE id = $1;
  `, [id])
    .then(res => {
      //console.log(res.rows[0]) // maybe need to add [0]?
      return res.rows[0]
    })
    .catch(err => console.error('query error', err.stack));
  //return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  //console.log("user:" + user)
  let arr = [user.name, user.email, user.password]; // how to change this input?
  //console.log(arr)
  return pool
  .query(
      `INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3) RETURNING *;
  `, arr)
    .then(res => {
      console.log(res.rows[0])
      return res.rows[0]
    })
    .catch(err => console.error('query error', err.stack));

}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {

  return pool
    .query(`
SELECT properties.*, reservations.*, avg(rating) as average_rating
FROM reservations
JOIN properties ON reservations.property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id 
WHERE reservations.guest_id = $1
AND reservations.end_date < now()::date
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT $2;
`, [guest_id, limit])
    .then(res => {
      console.log(res.rows)
      return res.rows
    })
    .catch(err => console.error('query error', err.stack));
  //return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function (options, limit = 10) {
//   console.log(options);
//   let arr = [options.city, options.owner_id, options.minimum_price_per_night, options.maximum_price_per_night, options.minimum_rating]
//   return pool
//   .query(`
//   SELECT properties.*, avg(property_reviews.rating) as average_rating
//   FROM properties
//   JOIN property_reviews ON properties.id = property_id
//   WHERE city LIKE $1
//   GROUP BY properties.id
//   HAVING avg(property_reviews.rating) >= $5
//   ORDER BY cost_per_night
//   LIMIT $6;  
//   `, [limit])
//     .then(res => res.rows)

const getAllProperties = function (options, limit = 10) {
  console.log(options)
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  LEFT JOIN property_reviews ON properties.id = property_id
  
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `WHERE owner_id = $${queryParams.length} `;
  }
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += ` WHERE cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length}`;
  }
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `
    GROUP BY properties.id
    HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
  }
  // 4
  queryParams.push(limit);

  if (options.minimum_rating) {
    queryString += `
    
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

    // 5
    console.log(queryString, queryParams);

    // 6
    return pool.query(queryString, queryParams)
      .then(res => res.rows)
      .catch(err => console.error('query error', err.stack));
  } else {

    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

    // 5
    console.log(queryString, queryParams);

    // 6
    return pool.query(queryString, queryParams)
      .then(res => res.rows)
      .catch(err => console.error('query error', err.stack));
  }}
  exports.getAllProperties = getAllProperties;


  /**
   * Add a property to the database
   * @param {{}} property An object containing all of the property details.
   * @return {Promise<{}>} A promise to the property.
   */
  const addProperty = function (property) {
    console.log(property)
    let propertyValues = Object.values(property) //
    console.log(propertyValues)
    // let arr = [
    //   property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, 
    //   property.street, property.city, property.province, property.post_code, property.country, 
    //   property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms];
  //console.log(arr)
    return pool
    .query(
        `INSERT INTO properties (
          owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, 
          parking_spaces, number_of_bathrooms, number_of_bedrooms, 
          country, street, city, province, post_code)
        VALUES ($1, $2, $3, $4, $5, $6, 
          $12, $13, $14, 
          $11, $7, $8, $9, $10) RETURNING *;
    `, propertyValues)
    .then(res => {
      //console.log(res.rows[0])
      return res.rows[0]
    })
    .catch(err => console.error('query error', err.stack));
    // const propertyId = Object.keys(properties).length + 1;
    // property.id = propertyId;
    // properties[propertyId] = property;
    // return Promise.resolve(property);
  }
  exports.addProperty = addProperty;

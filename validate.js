const { validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Product validation rules
const productValidation = {
    create: [
        {
            name: 'name',
            rules: {
                notEmpty: true,
                isLength: { min: 3, max: 100 }
            }
        },
        {
            name: 'category',
            rules: {
                notEmpty: true
            }
        },
        {
            name: 'price',
            rules: {
                isFloat: { min: 0 }
            }
        },
        {
            name: 'description',
            rules: {
                notEmpty: true,
                isLength: { min: 10 }
            }
        },
        {
            name: 'stock',
            rules: {
                isInt: { min: 0 }
            }
        }
    ]
};

// User validation rules
const userValidation = {
    register: [
        {
            name: 'name',
            rules: {
                notEmpty: true,
                isLength: { min: 2, max: 50 }
            }
        },
        {
            name: 'email',
            rules: {
                isEmail: true,
                normalizeEmail: true
            }
        },
        {
            name: 'password',
            rules: {
                isLength: { min: 6 }
            }
        },
        {
            name: 'phone',
            rules: {
                optional: true,
                matches: /^[0-9]{10}$/
            }
        }
    ],
    login: [
        {
            name: 'email',
            rules: {
                isEmail: true,
                normalizeEmail: true
            }
        },
        {
            name: 'password',
            rules: {
                notEmpty: true
            }
        }
    ]
};

// Order validation rules
const orderValidation = {
    create: [
        {
            name: 'items',
            rules: {
                isArray: true,
                notEmpty: true
            }
        },
        {
            name: 'shippingAddress',
            rules: {
                notEmpty: true
            }
        },
        {
            name: 'paymentMethod',
            rules: {
                isIn: {
                    options: [['credit_card', 'debit_card', 'upi', 'net_banking']]
                }
            }
        }
    ]
};

module.exports = {
    validate,
    productValidation,
    userValidation,
    orderValidation
}; 
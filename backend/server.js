const express = require('express');
const fs = require('fs');
const path = require('path');
const { create } = require('express-handlebars'); // For SSR with Handlebars

const app = express();
const PORT = 3000;

// Configure Handlebars
const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    helpers: {
        gt: (a, b) => a > b, // Define the greater-than helper
        incrementIndex: () => { return globalIndex++;  },
        resetIndex: () => { globalIndex = 0; },
        normalize: function (category) { // Convert to lowercase and remove spaces
            return category.toLowerCase().replace(/\s+/g, '');
        }
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

function simulateLoadTime() {
    return new Promise((resolve) => setTimeout(resolve, 50));
}


// Serve API endpoint for menu.json
app.get('/api/menu', async (req, res) => {
    const menuFilePath = path.join(__dirname, 'menu.json');
    await simulateLoadTime();
    fs.readFile(menuFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading menu.json:", err);
            res.status(500).json({ error: "Could not read menu file" });
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Render Handlebars template for SSR
app.get('/ssr', async (req, res) => {
    const menuFilePath = path.join(__dirname, 'menu.json');
    await simulateLoadTime();
    
    // Determine imgdir and imgext based on the query parameter
    const imgParam = req.query.img;
    let imgdir = 'imgoptic';
    let imgext = 'webp';

    if (imgParam === 'jpg') {
        imgdir = 'img';
        imgext = 'jpg';
    } else if (imgParam === 'png') {
        imgdir = 'imgsize';
        imgext = 'png';
    } else if (imgParam === 'webp') {
        imgdir = 'imgopti';
        imgext = 'webp';
    }

    fs.readFile(menuFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading menu.json:", err);
            res.status(500).send("Could not load menu");
            return;
        }

        const menu = JSON.parse(data);

        // Detect mobile user-agent
        let isMobile = /mobile|android|iphone|ipad|blackberry/i.test(req.headers['user-agent']);
        if(req.query.lazy === "false") isMobile = false;
        
        res.render('menu', {
            title: 'Cafe V - menu',
            categories: menu,
            imgdir,
            imgext,
            content: 'Explore our dynamic menu with customizable filters for categories like Salads, Burgers, Sandwiches, and Drinks. Find your favorite dishes with ease, presented in a clean and responsive layout.',
            isMobile,
        });
    });
});

// Serve the React app for /rcs
app.use('/rcs', express.static(path.join(__dirname, '../public')));

// Function to serve files with a fallback
function serveWithFallback(folderName, defaultFile) {
    return (req, res) => {
        const filePath = path.join(__dirname, folderName, req.path);

        res.sendFile(filePath, (err) => {
            if (err) {
                // If requested file not found, use default fallback
                res.sendFile(path.join(__dirname, folderName, defaultFile));
            }
        });
    };
}

// Serve unoptimized images with fallback
app.use('/img', serveWithFallback('img', 'default.jpg'));

// Serve resized images with fallback
app.use('/imgsize', serveWithFallback('imgsize', 'default.png'));

// Serve optimized images with fallback
app.use('/imgopti', serveWithFallback('imgopti', 'default.webp'));
app.use('/static', (req, res) => {
    const filePath = path.join(__dirname, 'static', req.path);

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('Not Found');
        }
    });
});


// Default route
app.get('/', (req, res) => {
   
   res.render('index', {
    title: 'Rendering Demonstration Overview',
    content: 'Explore different webserver setups'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

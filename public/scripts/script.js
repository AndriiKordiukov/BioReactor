document.addEventListener('DOMContentLoaded', function() {
  // Create the header HTML
  const headerHTML = `
 <header>
        <div class="header-container">
            <div class="header-left">
                <img src="./icons/bioreactor-logo.png" alt="Logo" class="logo" link="/">
                <a id="bioreactor-logo" href="/">BioReactor</a>
            </div>
            <div class="header-center">
                <nav>
                    <ul class="nav-links">
                        <li class="dropdown">
                            <button class="dropbtn">Nutrients</button>
                            <div class="dropdown-content">
                                <a href="/vitamins">Vitamins</a>
                                <a href="/minerals">Minerals</a>
                                <a href="/aminoacids">Aminoacids</a>
                            </div>
                        </li>
                        <li><a href="/food">Food</a></li>
                        <li><a href="/discover">DiscoverS</a></li>
                    </ul>
                </nav>
            </div>
            <div class="header-right">
                <div class="search-container">
                    <button class="search-btn">
                        <img src="./icons/svg/search.svg" alt="Search">
                    </button>
                    <input type="text" class="search-input" placeholder="Search...">
                </div>
            </div>
        </div>
    </header>
  `;

  // Insert the header HTML at the beginning of the body
  document.body.insertAdjacentHTML('beforebegin', headerHTML);
});
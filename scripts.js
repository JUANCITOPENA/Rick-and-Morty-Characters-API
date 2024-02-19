document.addEventListener("DOMContentLoaded", function() {
    const baseUrl = 'https://rickandmortyapi.com/api/character/';
    let currentPage = 1;
    let allCharacters = [];

    // Function to fetch characters from the API
    function fetchCharacters(page = 1) {
        $.get(baseUrl + `?page=${page}`, function (data) {
            allCharacters = data.results;
            displayCharacters(allCharacters);
            createPagination(data.info);
        });
    }

    // Function to display characters on the page
    function displayCharacters(characters) {
        const characterCards = $('#characterCards');
        characterCards.empty();
        const charactersPerPage = characters.slice(0, 9); // Mostrar solo las primeras 9 tarjetas
        charactersPerPage.forEach(character => {
            const card = `
                <div class="col-md-4">
                    <div class="card">
                        <img src="${character.image}" class="card-img-top" alt="${character.name}">
                        <div class="card-body">
                            <h5 class="card-title">${character.name}</h5>
                            <p class="card-text">${character.species}</p>
                            <button type="button" class="btn btn-primary btn-sm btn-view-more" data-id="${character.id}">Ver más</button>
                        </div>
                    </div>
                </div>
            `;
            characterCards.append(card);
        });
    }

    // Function to create pagination
    function createPagination(info) {
        const pagination = $('#pagination');
        pagination.empty();
        if (info.prev) {
            pagination.append(`<li class="page-item"><a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a></li>`);
        }
        if (info.next) {
            pagination.append(`<li class="page-item"><a class="page-link" href="#" data-page="${currentPage + 1}">Next</a></li>`);
        }
    }

    // Function to handle pagination clicks
    $(document).on('click', '.page-link', function (e) {
        e.preventDefault();
        const page = $(this).data('page');
        currentPage = page;
        fetchCharacters(page);
    });

    // Function to handle search button click
    $('#searchButton').click(function () {
        const searchTerm = $('#searchInput').val().trim().toLowerCase();
        if (searchTerm !== '') {
            const filteredCharacters = allCharacters.filter(character =>
                character.name.toLowerCase().includes(searchTerm)
            );
            displayCharacters(filteredCharacters);
            $('#pagination').empty(); // Clear pagination for search results
        } else {
            fetchCharacters();
        }
    });

    // Function to handle clear button click
    $('#clearButton').click(function () {
        $('#searchInput').val(''); // Limpiar el campo de búsqueda
        fetchCharacters(); // Mostrar todos los personajes nuevamente
    });

    // Event listener for "Ver más" button click
    $(document).on('click', '.btn-view-more', function () {
        const characterId = $(this).data('id');
        fetchCharacterDetails(characterId);
    });

    // Function to fetch character details by ID
    function fetchCharacterDetails(characterId) {
        const characterUrl = `${baseUrl}${characterId}`;
        $.get(characterUrl, function (character) {
            showCharacterModal(character);
        });
    }

    // Function to show character details in modal
    function showCharacterModal(character) {
        $('#characterName').text(character.name);
        $('#characterDescription').html(`
            <p><strong>Gender:</strong> ${character.gender}</p>
            <p><strong>Species:</strong> ${character.species}</p>
            <p><strong>Status:</strong> ${character.status}</p>
            <p><strong>Origin:</strong> ${character.origin.name}</p>
            <p><strong>Created:</strong> ${character.created}</p>
        `);
        $('#characterModal').modal('show');
    }

    // Fetch characters when the page loads
    fetchCharacters();
});

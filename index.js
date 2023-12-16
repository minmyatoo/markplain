const express = require('express');
const fs = require('fs');
const marked = require('marked');
const showdown = require('showdown');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/convert', (req, res) => {
    const mdText = req.body.markdown;

    // Convert Markdown to HTML using 'showdown' library
    const converter = new showdown.Converter();
    const htmlText = converter.makeHtml(mdText);

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <title>Markdown to Plain Text Converter</title>
        </head>
        <body class="container mt-5">
            <h1 class="mb-4">Markdown to Plain Text Converter</h1>

            <form action="/convert" method="post">
                <div class="mb-3">
                    <label for="markdownInput" class="form-label">Enter Markdown Text:</label>
                    <textarea class="form-control" id="markdownInput" name="markdown" rows="10" required>${mdText}</textarea>
                </div>
                <button type="submit" class="btn btn-primary">Convert</button>
            </form>

           <div id="result" class="mt-4">
                <h3 class="mb-3">HTML Result</h3>
                <div class="card">
                    <div class="card-body">
                        <pre><code id="htmlCode" class="html-code">${htmlText}</code></pre>
                    </div>
                </div>
                <button class="btn btn-secondary mt-3" id="copyButton">
                    <i class="bi bi-clipboard"></i> Copy HTML
                </button>
                <button class="btn btn-light mt-3" id="clearButton">
                    <i class="bi bi-trash"></i> Clear
                </button>
            </div>

            <script src="https://unpkg.com/bootstrap-icons@1.19.0/font/bootstrap-icons.css"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
             <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script> <!-- Include SweetAlert -->
            <script>
                document.getElementById('copyButton').addEventListener('click', function () {
                    const htmlCode = document.getElementById('htmlCode');
                    const textArea = document.createElement('textarea');
                    textArea.value = htmlCode.innerText;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                     Swal.fire({
                        icon: 'success',
                        title: 'Copied!',
                        text: 'Text successfully copied to the clipboard!',
                    });
                });

                document.getElementById('clearButton').addEventListener('click', function () {
                    document.getElementById('markdownInput').value = '';
                    document.getElementById('htmlCode').innerText = '';
                });
                
                // Add word count under the textarea
                const markdownInput = document.getElementById('markdownInput');
                const wordCountElement = document.createElement('div');
                wordCountElement.innerHTML = '<p class="mt-2">Word Count: <span id="wordCount">0</span></p>';
                document.getElementById('result').appendChild(wordCountElement);

                markdownInput.addEventListener('input', function () {
                    const wordCount = this.value.split(/\\s+/).filter(function (word) {
                        return word.length > 0;
                    }).length;
                    document.getElementById('wordCount').innerText = wordCount;
                });
                
            </script>
            
        </body>
         <footer class="text-center mt-4">
            <p>&copy; 2023 Mike with ❤️</p>
        </footer>
        </html>
    `);
});

// Export app for testing or other use (e.g., running in GitHub Actions)
module.exports = app;

// If the script is run directly, start the server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

# `foil`

Ever needed to share a PDF and annotate it along with your mates?

Then you might have played
* flashbang squash with email attachments along increasingly confusing threads
* dung weightlifting with enormous git repos rendered useless by binary data
* tapdancing jenga with dropbox versions while descending towards insanity
* other tormenting games of your choice

You can stop the pain right now. Read on.

## The gist

* PDF files can be annotated by many softwares.
* Annotations can *actually* be extracted as XML files[^XFDF] by many frameworks.
* XML is sourcecode and it is easily versioned by source control softwares.

[^XFDF]: It's called `XFDF`. You can read the [Adobe implementation notes](https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/formsys.pdf) or the [ISO specification](https://www.iso.org/obp/ui/#iso:std:iso:19444:-1:ed-2:v1:en). You can, but you probably won't.

This implies that you can effectively use a source control software by
* commiting your unannotated PDFs and never touch them again
* commiting the annotations separately as easily versioned XMLs
* use uncommitted PDFs generated on the fly to alter the annotations

That's exactly what `foils` makes trivial.

## Setup

### Using host machine

1. Install [Node.js](https://nodejs.org/)
2. Clone this repo
   ```
   git clone git@github.com:paolobrasolin/foil.git
   ```
3. Install dependencies
   ```
   npm install
   ```
4. Run `foil`
   ```
   node index.js
   ```

### Using Docker

1. Clone this repo
   ```
   git clone git@github.com:paolobrasolin/foil.git
   ```
2. Build Docker image
   ```
   docker build -t foil .
   ```
3. Run `foil`
   ```
   docker run -v $(pwd):/data foil
   ```

You might find useful setting a bash alias:
```bash
alias foil="docker run -v $(pwd):/data foil"
```

## Usage

`foil` is a utility which has just two commands:

* `foil peel <NAME>.pdf` extracts annotations from `<NAME>.ann.pdf` into `<NAME>.xfdf`
* `foil wrap <NAME>.pdf` applies annotations from `<NAME>.xfdf` to `<NAME>.pdf` producing `<NAME>.ann.pdf`

To get started,
```bash
# Get your unannotated pdf into your repo; Let's say it's `book.pdf`.
git add book.pdf
git commit -m "Added book"
cp book.pdf book.ann.pdf
```

To share your notes,
```bash
# Annotate and save book.ann.pdf
./foil.js peel book.pdf
git add book.xfdf
git commit -m "Added some notes to book"
git push
```

To get your peers' notes,
```bash
git pull
./foil.js wrap book.pdf
# Read new notes on book.ann.pdf
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

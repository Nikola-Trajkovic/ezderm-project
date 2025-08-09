# Ezderm Project

A simple web application that allows users to search for books using the **Open Library API**, view detailed information about selected books, and revisit previously viewed books.  
The application is built with **Next.js** and **TypeScript**.

## 🚀 Live Demo
The application is deployed and available here:  
[https://ezderm-project-b1vg59bzw-nikolas-projects-8ba8733b.vercel.app/](https://ezderm-project-b1vg59bzw-nikolas-projects-8ba8733b.vercel.app/)

## 📌 Features
- **Book Search:** Search for books by title.
- **Book Details Page:** View additional information such as:
  - Cover image
  - Author
  - Published Date
  - Author Details
  - Short description
- **Previously Viewed Books:** Quickly revisit books you've already checked.
- **Cover Filtering:** Only displays books that have a cover image.

## 🛠️ Tech Stack
- **Frontend Framework:** [Next.js](https://nextjs.org/) (with TypeScript)
- **Styling:** Tailwind CSS
- **API:** [Open Library API](https://openlibrary.org/developers/api)

## 📂 Project Structure
- **Landing Page:** Contains the search bar, search results, and previously viewed books.
- **Book Details Page:** Displays extended information about the selected book, and previously viewed books.

## 🔌 API Endpoints Used
- Search books by title:  
  ```
  https://openlibrary.org/search.json?title=${searchTerm}
  ```
- Get single book details:  
  ```
  https://openlibrary.org/works/${id}.json
  ```
- Get book cover:  
  ```
  https://covers.openlibrary.org/b/id/${coverId}-L.jpg
  ```
- Get author details:  
  ```
  https://openlibrary.org/authors/${authorKey}.json
  ```

## 📦 Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Nikola-Trajkovic/ezderm-project.git
   ```
2. Navigate into the project folder:
   ```bash
   cd ezderm-project
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

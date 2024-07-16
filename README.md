# Cloudsnap

Cloudsnap is a comprehensive media management web application built with Next.js and Node.js. It provides users with an intuitive interface to upload, organize, and manage their media files securely and efficiently.

![Screenshot](/public/screenshot1.png)

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- Secure user authentication using JWT.
- Media upload, storage, and retrieval with Cloudinary.
- Responsive and intuitive user interface with Tailwind CSS.
- Profile management and personalized user settings.
- Integrated help support for user assistance.

## Technologies Used

- **Frontend:**
  - React.js
  - Next.js
  - Tailwind CSS

- **Backend:**
  - Node.js
  - MongoDB
  - Mongoose

- **Utilities:**
  - JSON Web Tokens (JWT)
  - Nodemailer
  - Cloudinary

## Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ak225598/cloudsnap.git
   cd cloudsnap
2. **Install dependencies:**
   ```bash
   npm install
3. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following environment variables:
     ```env
      DB_CONNECTION_URL=<your-mongodb-connection-string>
      JWT_SECRET_KEY=<your-jwt-secret-key>
      MAILER_HOST=<your-mailer-host>
      MAILER_SERVICE=<your-mailer-service>
      MAILER_PORT=<your-mailer-port>
      MAILER_EMAIL=<your-mailer-email>
      MAILER_PASSWORD=<your-mailer-password>
      MAILER_LOGO_URL=<your-mailer-logo-url>
      DOMAIN=<your-domain>
      CLOUDINARY_NAME=<your-cloudinary-name>
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
      NEXT_PUBLIC_CLOUDINARY_API_KEY=<your-cloudinary-api-key>
      CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
     ```
4. **Run the application:**
   ```bash
   npm run dev
5. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`.

## Usage
  You can see the live application [here](https://cloudsnap-two.vercel.app/).
- **User Authentication:**
  - Sign up, log in, and manage your profile securely.

- **Media Management:**
  - Upload, view, and delete media files easily.
  - Organize your media with a user-friendly interface.

- **Profile Management:**
  - Update personal information and change password.
  - Customize settings for a personalized experience.

- **Help and Support:**
  - Access integrated help for assistance with common issues.

## Contributing

Contributions to Cloudsnap are appreciated! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

Your pull request will be reviewed as soon as possible. Thank you for your interest in improving Cloudsnap!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions, feedback, or need support, feel free to reach out:

- **Email**: [ankit.iiitbh@gmail.com](mailto:ankit.iiitbh@gmail.com)
- **LinkedIn**: [Ankit Kumar](https://www.linkedin.com/in/ankitkumar225)

---

Thank you for using Cloudsnap.

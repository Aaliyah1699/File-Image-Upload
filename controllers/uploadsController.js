const path = require("path");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const cloudinary = require("cloudinary").v2;

const uploadProductImage = async (req, res) => {
    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: "Files and Image upload api",
        }
    );
    return res
        .status(StatusCodes.OK)
        .json({ image: { src: result.secure_url } });
};

const uploadProductImageLocal = async (req, res) => {
    // check - if file exist, format, and size
    if (!req.files) {
        throw new customError.BadRequestError("No File Uploaded");
    }
    const productImage = req.files.image;

    if (!productImage.mimetype.startsWith("image")) {
        throw new customError.BadRequestError("Please Upload Image");
    }
    const maxSize = 1024 * 1024;
    if (productImage.size > maxSize) {
        throw new customError.BadRequestError(
            "Please Upload Image Smaller 1MB"
        );
    }

    const imagePath = path.join(
        __dirname,
        "../public/uploads/" + `${productImage.name}`
    );

    await productImage.mv(imagePath);
    return res
        .status(StatusCodes.OK)
        .json({ image: { src: `/uploads/${productImage.name}` } });
};

module.exports = { uploadProductImage };

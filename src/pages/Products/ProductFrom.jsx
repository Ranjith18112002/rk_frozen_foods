import { useEffect, useState } from "react";

import { useNavigate, useParams, useLocation } from "react-router-dom";

import {

  Package,

  ArrowLeft,

  ImagePlus,

  X,

  Save,

  RotateCcw,

} from "lucide-react";

import { getCategories } from "../../services/categoryService";

import {

  createProduct,

  getProducts,

  updateProduct,

} from "../../services/productService";

const initialFormData = {

  name: "",

  sku: "",

  category: "",

  type: "",

  packSize: "",

  price: "",

  description: "",

  allergenInformation: "",

  recommendedUse: "",

  highlights: "",

  ingredients: "",

  nutritionInformation: {

    basis: "per 100g",

    energyKcal: "",

    proteinG: "",

    fatG: "",

    saturatedFatG: "",

    transFatG: "",

    carbohydratesG: "",

    sugarG: "",

    cholesterolMg: "",

  },

  status: "Active",

  featured: false,

  isNew: false,

};

const getResponseData = (response) =>

  response?.data?.data ?? response?.data ?? response;

const getId = (item) => String(item?._id || item?.id || "");

const ProductForm = () => {

  const navigate = useNavigate();

  const { id } = useParams();

  const location = useLocation();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);

  const [categories, setCategories] = useState([]);

  const [images, setImages] = useState([]);

  const [existingImages, setExistingImages] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(true);

  const [loadingProduct, setLoadingProduct] = useState(isEditMode);

  const [saving, setSaving] = useState(false);

  const [processingImages, setProcessingImages] = useState(false);

  const [error, setError] = useState("");

  // --------------------------------------------------

  // CATEGORY NORMALIZER

  // --------------------------------------------------

  const normalizeCategory = (category) => {

    const parent = category?.parentCategory;

    return {

      ...category,

      id: getId(category),

      parentCategoryId:

        typeof parent === "object" && parent !== null

          ? getId(parent)

          : parent || null,
        status: category?.status || "Active",

    };

  };

  // --------------------------------------------------

  // PRODUCT FORM POPULATION

  // --------------------------------------------------

  const populateProduct = (product) => {

    if (!product) return;

    const categoryValue =

      typeof product.category === "object" && product.category !== null

        ? getId(product.category)

        : product.category || product.categoryId || "";

    const productImages = Array.isArray(product.images)

      ? product.images

      : product.image

        ? [product.image]

        : [];

    const nutrition = product.nutritionInformation || {};

    setFormData({

      name: product.name || "",

      sku: product.sku || "",

      category: categoryValue,

      type: product.type || "",

      packSize: product.packSize || "",

      price: product.price ?? "",

      description: product.description || "",

      allergenInformation: product.allergenInformation || "",

      recommendedUse: product.recommendedUse || "",

      highlights: Array.isArray(product.highlights)

        ? product.highlights.join("\n")

        : "",

      ingredients: Array.isArray(product.ingredients)

        ? product.ingredients.join("\n")

        : "",

      nutritionInformation: {

        basis: nutrition.basis || "per 100g",

        energyKcal: nutrition.energyKcal ?? "",

        proteinG: nutrition.proteinG ?? "",

        fatG: nutrition.fatG ?? "",

        saturatedFatG: nutrition.saturatedFatG ?? "",

        transFatG: nutrition.transFatG ?? "",

        carbohydratesG: nutrition.carbohydratesG ?? "",

        sugarG: nutrition.sugarG ?? "",

        cholesterolMg: nutrition.cholesterolMg ?? "",

      },

      status: product.status || "Active",

      featured: product.featured === true || product.featured === "true",

      isNew: product.isNew === true || product.isNew === "true",

    });

    setExistingImages(productImages);

    setImages([]);

  };

  // --------------------------------------------------

  // FETCH CATEGORIES AND PRODUCT

  // --------------------------------------------------

  useEffect(() => {

    let isMounted = true;

    const fetchData = async () => {

      try {

        setError("");

        const categoryPromise = getCategories();

        const productPromise = isEditMode

          ? getProducts()

          : Promise.resolve(null);

        const [categoryResponse, productResponse] = await Promise.all([

          categoryPromise,

          productPromise,

        ]);

        if (!isMounted) return;

        const categoryData = getResponseData(categoryResponse);

        const categoryList = Array.isArray(categoryData)

          ? categoryData

          : categoryData?.categories || [];

        setCategories(categoryList.map(normalizeCategory));

        if (isEditMode) {

          const productData = getResponseData(productResponse);

          const productList = Array.isArray(productData)

            ? productData

            : productData?.products || [];

          const product = productList.find(

            (item) => getId(item) === String(id),

          );

          if (!product) {

            setError("Product not found.");

            return;

          }

          populateProduct(product);

        }

      } catch (err) {

        if (!isMounted) return;

        setError(

          err.response?.data?.message || "Unable to load product details.",

        );

      } finally {

        if (isMounted) {

          setLoadingCategories(false);

          setLoadingProduct(false);

        }

      }

    };

    fetchData();

    return () => {

      isMounted = false;

    };

  }, [id, isEditMode]);

  // --------------------------------------------------

    // SELECTABLE CATEGORIES:
  // New products can use only Active categories whose parent is also Active.
  const activeMainCategoryIds = new Set(
    categories
      .filter(
        (category) =>
          !category.parentCategoryId && category.status === "Active"
      )
      .map((category) => category.id)
  );

  const activeSelectableCategories = categories.filter((category) => {
    if (category.status !== "Active") return false;

    // Active main categories are selectable.
    if (!category.parentCategoryId) return true;

    // A subcategory is selectable only when its parent is Active.
    return activeMainCategoryIds.has(category.parentCategoryId);
  });

  // In edit mode, retain the product's currently assigned category even if
  // it has since become inactive, so the existing product can still be edited.
  const currentlyAssignedCategory = isEditMode
    ? categories.find((category) => category.id === formData.category)
    : null;

  const selectableCategories =
    currentlyAssignedCategory &&
    !activeSelectableCategories.some(
      (category) => category.id === currentlyAssignedCategory.id
    )
      ? [...activeSelectableCategories, currentlyAssignedCategory]
      : activeSelectableCategories;

  // INPUT CHANGE

  // --------------------------------------------------

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]: type === "checkbox" ? checked : value,

    }));

  };

  const handleNutritionChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({

      ...prev,

      nutritionInformation: {

        ...prev.nutritionInformation,

        [name]: value,

      },

    }));

  };

  // --------------------------------------------------

  // IMAGE RESIZE TO 239 x 239

  // --------------------------------------------------

  const resizeImage = (file) =>

    new Promise((resolve, reject) => {

      const imageUrl = URL.createObjectURL(file);

      const image = new Image();

      image.onload = () => {

        try {

          const canvas = document.createElement("canvas");

          const context = canvas.getContext("2d");

          const size = 239;

          canvas.width = size;

          canvas.height = size;

          // Center crop without stretching.

          const cropSize = Math.min(

            image.naturalWidth,

            image.naturalHeight,

          );

          const sourceX = (image.naturalWidth - cropSize) / 2;

          const sourceY = (image.naturalHeight - cropSize) / 2;

          context.drawImage(

            image,

            sourceX,

            sourceY,

            cropSize,

            cropSize,

            0,

            0,

            size,

            size,

          );

          canvas.toBlob(

            (blob) => {

              URL.revokeObjectURL(imageUrl);

              if (!blob) {

                reject(new Error("Image conversion failed."));

                return;

              }

              const resizedFile = new File(

                [blob],

                file.name.replace(/\.[^/.]+$/, ".jpg"),

                {

                  type: "image/jpeg",

                  lastModified: Date.now(),

                },

              );

              resolve(resizedFile);

            },

            "image/jpeg",

            0.85,

          );

        } catch (error) {

          URL.revokeObjectURL(imageUrl);

          reject(error);

        }

      };

      image.onerror = () => {

        URL.revokeObjectURL(imageUrl);

        reject(new Error("Unable to read image."));

      };

      image.src = imageUrl;

    });

  // --------------------------------------------------

  // IMAGE UPLOAD

  // --------------------------------------------------

  const handleImageChange = async (e) => {

    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const availableSlots = 5 - existingImages.length - images.length;

    if (availableSlots <= 0) {

      setError("Maximum 5 product images are allowed.");

      e.target.value = "";

      return;

    }

    setProcessingImages(true);

    setError("");

    const validFiles = [];

    const validationErrors = [];

    try {

      for (const file of selectedFiles) {

        if (!allowedTypes.includes(file.type)) {

          validationErrors.push(

            `${file.name}: JPG, PNG or WEBP images only are allowed.`,

          );

          continue;

        }

        try {

          const resizedFile = await resizeImage(file);

          if (resizedFile.size > 500 * 1024) {

            validationErrors.push(

              `${file.name}: Converted image is larger than 500KB.`,

            );

            continue;

          }

          validFiles.push(resizedFile);

        } catch {

          validationErrors.push(`${file.name}: Unable to resize this image.`);

        }

      }

      const selected = validFiles.slice(0, availableSlots);

      if (validFiles.length > availableSlots) {

        validationErrors.push(

          `Only ${availableSlots} more image(s) can be added. Maximum 5 images are allowed.`,

        );

      }

      if (selected.length > 0) {

        setImages((prev) => [...prev, ...selected]);

      }

      setError(validationErrors.join(" "));

    } finally {

      setProcessingImages(false);

      e.target.value = "";

    }

  };

  // --------------------------------------------------

  // REMOVE IMAGES

  // --------------------------------------------------

  const removeNewImage = (index) => {

    setImages((prev) => prev.filter((_, i) => i !== index));

  };

  const removeExistingImage = (index) => {

    setExistingImages((prev) => prev.filter((_, i) => i !== index));

  };

  // --------------------------------------------------

  // RESET FORM

  // --------------------------------------------------

  const handleReset = () => {

    setError("");

    setImages([]);

    if (isEditMode) {

      const product = location.state?.product;

      if (product) {

        populateProduct(product);

      } else {

        window.location.reload();

      }

    } else {

      setFormData(initialFormData);

      setExistingImages([]);

    }

  };

  // --------------------------------------------------

  // SUBMIT PRODUCT

  // --------------------------------------------------

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (processingImages) {

      setError("Please wait until image processing is complete.");

      return;

    }

    if (!formData.name.trim()) {

      setError("Please enter product name.");

      return;

    }

    if (!formData.sku.trim()) {

      setError("Please enter product SKU.");

      return;

    }

    if (!formData.category) {

      setError("Please select a category or subcategory.");

      return;

    }

    if (!formData.type) {

      setError("Please select product type.");

      return;

    }

    if (!formData.packSize.trim()) {

      setError("Please enter pack size.");

      return;

    }

    if (

      formData.price === "" ||

      !Number.isFinite(Number(formData.price)) ||

      Number(formData.price) < 0

    ) {

      setError("Please enter a valid product price.");

      return;

    }

    if (!formData.description.trim()) {

      setError("Please enter product description.");

      return;

    }

    const selectedCategory = selectableCategories.find(

      (category) => category.id === formData.category,

    );

    if (!selectedCategory) {

      setError("Please select a valid category or subcategory.");

      return;

    }

    const totalImages = existingImages.length + images.length;

    if (totalImages > 5) {

      setError("Maximum 5 product images are allowed.");

      return;

    }

    try {

      setSaving(true);

      const productData = new FormData();

      productData.append("name", formData.name.trim());

      productData.append("sku", formData.sku.trim());

      productData.append("category", formData.category);

      productData.append("type", formData.type);

      productData.append("packSize", formData.packSize.trim());

      productData.append("price", String(Number(formData.price)));

      productData.append("description", formData.description.trim());

      productData.append(

        "allergenInformation",

        formData.allergenInformation.trim(),

      );

      productData.append(

        "recommendedUse",

        formData.recommendedUse.trim(),

      );

      productData.append(

        "highlights",

        JSON.stringify(

          formData.highlights

            .split("\n")

            .map((item) => item.trim())

            .filter(Boolean),

        ),

      );

      productData.append(

        "ingredients",

        JSON.stringify(

          formData.ingredients

            .split("\n")

            .map((item) => item.trim())

            .filter(Boolean),

        ),

      );

      // Nutrition fields.

      const nutrition = {

        basis: formData.nutritionInformation.basis,

      };

      const nutritionFields = [

        "energyKcal",

        "proteinG",

        "fatG",

        "saturatedFatG",

        "transFatG",

        "carbohydratesG",

        "sugarG",

        "cholesterolMg",

      ];

      nutritionFields.forEach((field) => {

        const value = formData.nutritionInformation[field];

        if (value !== "" && value !== null && value !== undefined) {

          nutrition[field] = Number(value);

        }

      });

      const hasNutritionValues = nutritionFields.some(

        (field) =>

          formData.nutritionInformation[field] !== "" &&

          formData.nutritionInformation[field] !== null &&

          formData.nutritionInformation[field] !== undefined,

      );

      if (hasNutritionValues) {

        productData.append(

          "nutritionInformation",

          JSON.stringify(nutrition),

        );

      }

      productData.append("status", formData.status);

      productData.append("featured", String(formData.featured));

      productData.append("isNew", String(formData.isNew));

      // Existing image URLs.

      productData.append(

        "existingImages",

        JSON.stringify(existingImages),

      );

      // Converted 239 x 239 image files.

      images.forEach((image) => {

        productData.append("images", image);

      });

      if (isEditMode) {

        await updateProduct(id, productData);

        alert("Product updated successfully!");

      } else {

        await createProduct(productData);

        alert("Product created successfully!");

      }

      navigate("/products", { replace: true });

    } catch (err) {

      setError(

        err.response?.data?.message ||

          err.response?.data?.error ||

          `Unable to ${isEditMode ? "update" : "create"} product. Please try again.`,

      );

    } finally {

      setSaving(false);

    }

  };

  // --------------------------------------------------

  // STYLES

  // --------------------------------------------------

  const inputClass =

    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#111111] outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-[#65C92E] focus:ring-2 focus:ring-[#65C92E]/15";

  const labelClass = "mb-2 block text-sm font-semibold text-[#333333]";

  const sectionClass =

    "overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm";

  const sectionHeadingClass = "font-semibold text-[#111111]";

  // --------------------------------------------------

  // LOADING

  // --------------------------------------------------

  if (loadingProduct) {

    return (

      <div className="flex min-h-[300px] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#65C92E]/30 border-t-[#65C92E]" />

          <p className="mt-3 text-sm text-gray-500">

            Loading product details...

          </p>

        </div>

      </div>

    );

  }

  // --------------------------------------------------

  // UI

  // --------------------------------------------------

  return (

    <div className="space-y-6">

      {/* PAGE HEADING */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">

            <Package size={16} />

            <span>Products</span>

            <span>/</span>

            <span className="font-medium text-[#347F19]">

              {isEditMode ? "Edit Product" : "Add Product"}

            </span>

          </div>

          <h1 className="text-[30px] font-semibold leading-tight text-[#111111]">

            {isEditMode ? "Edit Product" : "Add New Product"}

          </h1>

          <p className="mt-1 text-sm text-gray-500">

            {isEditMode

              ? "Update your existing product details."

              : "Add a new frozen snack to your product inventory."}

          </p>

        </div>

        <button

          type="button"

          onClick={() => navigate("/products")}

          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-[#65C92E] hover:bg-[#EFF8E9] hover:text-[#347F19]"

        >

          <ArrowLeft size={17} />

          Back to Products

        </button>

      </div>

      {/* ERROR */}

      {error && (

        <div className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">

          <p>{error}</p>

          <button type="button" onClick={() => setError("")}>

            <X size={17} />

          </button>

        </div>

      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* PRODUCT INFORMATION */}

        <div className={sectionClass}>

          <div className="border-b border-gray-100 px-5 py-4">

            <h2 className={sectionHeadingClass}>Product Information</h2>

            <p className="mt-1 text-xs text-gray-500">

              Enter the basic details of your product.

            </p>

          </div>

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">

            <div>

              <label className={labelClass}>

                Product Name <span className="text-red-500">*</span>

              </label>

              <input

                name="name"

                value={formData.name}

                onChange={handleChange}

                placeholder="Enter product name"

                required

                className={inputClass}

              />

            </div>

            <div>

              <label className={labelClass}>

                Product SKU <span className="text-red-500">*</span>

              </label>

              <input

                name="sku"

                value={formData.sku}

                onChange={handleChange}

                placeholder="Example: RK001"

                required

                className={inputClass}

              />

            </div>

            <div>

              <label className={labelClass}>

                Category / Subcategory <span className="text-red-500">*</span>

              </label>

              <select

                name="category"

                value={formData.category}

                onChange={handleChange}

                required

                disabled={loadingCategories}

                className={inputClass}

              >

                <option value="">

                  {loadingCategories

                    ? "Loading categories..."

                    : "Select Category / Subcategory"}

                </option>

                {selectableCategories.map((category) => {

                                      const parent = categories.find(
                      (item) => item.id === category.parentCategoryId,
                    );
                    const isAvailable =
                      category.status === "Active" &&
                      (!category.parentCategoryId ||
                        activeMainCategoryIds.has(category.parentCategoryId));

                    return (
                      <option key={category.id} value={category.id}>
                        {parent ? `${parent.name} / ` : ""}
                        {category.name}
                        {!isAvailable ? " (Currently assigned - inactive)" : ""}
                      </option>
                    );

                })}

              </select>

              {!loadingCategories && selectableCategories.length === 0 && (

                <p className="mt-2 text-xs text-amber-600">

                  No active categories available. Please activate a category first.

                </p>

              )}

            </div>

            <div>

              <label className={labelClass}>

                Product Type <span className="text-red-500">*</span>

              </label>

              <select

                name="type"

                value={formData.type}

                onChange={handleChange}

                required

                className={inputClass}

              >

                <option value="">Select type</option>

                <option value="veg">Veg</option>

                <option value="non-veg">Non-Veg</option>

              </select>

            </div>

            <div>

              <label className={labelClass}>

                Pack Size <span className="text-red-500">*</span>

              </label>

              <input

                name="packSize"

                value={formData.packSize}

                onChange={handleChange}

                placeholder="Example: 500g / 1kg"

                required

                className={inputClass}

              />

            </div>

            <div>

              <label className={labelClass}>

                Price (₹) <span className="text-red-500">*</span>

              </label>

              <input

                type="number"

                name="price"

                value={formData.price}

                onChange={handleChange}

                placeholder="Enter product price"

                min="0"

                step="0.01"

                required

                className={inputClass}

              />

            </div>

            <div className="md:col-span-2">

              <label className={labelClass}>

                Product Description <span className="text-red-500">*</span>

              </label>

              <textarea

                name="description"

                value={formData.description}

                onChange={handleChange}

                rows={4}

                required

                placeholder="Write product description..."

                className={`${inputClass} resize-y`}

              />

            </div>

          </div>

        </div>

        {/* PRODUCT IMAGES */}

        <div className={sectionClass}>

          <div className="border-b border-gray-100 px-5 py-4">

            <h2 className={sectionHeadingClass}>Product Images</h2>

            <p className="mt-1 text-xs text-gray-500">

              Upload up to 5 images. JPG, PNG or WEBP. Images are automatically

              center-cropped and converted to 239 × 239 pixels. Maximum

              converted file size: 500KB.

            </p>

          </div>

          <div className="p-5">

            <div className="flex flex-wrap gap-4">

              {existingImages.map((src, index) => (

                <div key={`existing-${index}`} className="relative">

                  <img

                    src={src}

                    alt={`Existing product ${index + 1}`}

                    className="h-36 w-36 rounded-xl border border-gray-200 object-cover"

                  />

                  <button

                    type="button"

                    onClick={() => removeExistingImage(index)}

                    aria-label="Remove existing image"

                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white shadow-md hover:bg-red-600"

                  >

                    <X size={15} />

                  </button>

                  <p className="mt-1 text-center text-xs text-gray-400">

                    Existing image

                  </p>

                </div>

              ))}

              {images.map((file, index) => {

                const previewUrl = URL.createObjectURL(file);

                return (

                  <div key={`${file.name}-${index}`} className="relative">

                    <img

                      src={previewUrl}

                      alt={`New product ${index + 1}`}

                      className="h-36 w-36 rounded-xl border border-gray-200 object-cover"

                      onLoad={() => URL.revokeObjectURL(previewUrl)}

                    />

                    <button

                      type="button"

                      onClick={() => removeNewImage(index)}

                      aria-label="Remove selected image"

                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white shadow-md hover:bg-red-600"

                    >

                      <X size={15} />

                    </button>

                    <p className="mt-1 text-center text-xs text-gray-400">

                      239 × 239 px

                    </p>

                  </div>

                );

              })}

              {existingImages.length + images.length < 5 && (

                <label

                  className={`flex h-36 w-36 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-[#F7FAF5] p-3 text-center transition ${

                    processingImages

                      ? "cursor-not-allowed opacity-50"

                      : "cursor-pointer hover:border-[#65C92E] hover:bg-[#EFF8E9]"

                  }`}

                >

                  <div className="mb-2 rounded-full bg-[#EFF8E9] p-3 text-[#347F19]">

                    <ImagePlus size={24} />

                  </div>

                  <span className="text-xs font-semibold text-gray-700">

                    {processingImages ? "Processing..." : "Add Image"}

                  </span>

                  <input

                    type="file"

                    accept="image/png,image/jpeg,image/webp"

                    multiple

                    disabled={processingImages}

                    onChange={handleImageChange}

                    className="hidden"

                  />

                </label>

              )}

            </div>

            <p className="mt-4 text-xs text-gray-400">

              {existingImages.length + images.length} / 5 images selected

            </p>

            {processingImages && (

              <p className="mt-2 text-sm font-medium text-[#347F19]">

                Please wait. Converting images to 239 × 239...

              </p>

            )}

          </div>

        </div>

        {/* PRODUCT DETAILS */}

        <div className={sectionClass}>

          <div className="border-b border-gray-100 px-5 py-4">

            <h2 className={sectionHeadingClass}>Product Details</h2>

            <p className="mt-1 text-xs text-gray-500">

              Add ingredients, allergen details and recommended use.

            </p>

          </div>

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">

            <div>

              <label className={labelClass}>Allergen Information</label>

              <textarea

                name="allergenInformation"

                value={formData.allergenInformation}

                onChange={handleChange}

                rows={3}

                placeholder="Example: Contains wheat, milk..."

                className={`${inputClass} resize-y`}

              />

            </div>

            <div>

              <label className={labelClass}>Recommended Use</label>

              <textarea

                name="recommendedUse"

                value={formData.recommendedUse}

                onChange={handleChange}

                rows={3}

                placeholder="Example: Steam for 10 minutes..."

                className={`${inputClass} resize-y`}

              />

            </div>

            <div>

              <label className={labelClass}>Product Highlights</label>

              <textarea

                name="highlights"

                value={formData.highlights}

                onChange={handleChange}

                rows={5}

                placeholder={

                  "Enter one highlight per line\nFresh ingredients\nEasy to prepare"

                }

                className={`${inputClass} resize-y`}

              />

              <p className="mt-1 text-xs text-gray-400">

                Enter each highlight on a separate line.

              </p>

            </div>

            <div>

              <label className={labelClass}>Ingredients</label>

              <textarea

                name="ingredients"

                value={formData.ingredients}

                onChange={handleChange}

                rows={5}

                placeholder={

                  "Enter one ingredient per line\nChicken\nWheat flour\nOnion"

                }

                className={`${inputClass} resize-y`}

              />

              <p className="mt-1 text-xs text-gray-400">

                Enter each ingredient on a separate line.

              </p>

            </div>

          </div>

        </div>

        {/* NUTRITION INFORMATION */}

        <div className={sectionClass}>

          <div className="border-b border-gray-100 px-5 py-4">

            <h2 className={sectionHeadingClass}>Nutrition Information</h2>

            <p className="mt-1 text-xs text-gray-500">

              Enter nutrition values from the actual product packaging.

            </p>

          </div>

          <div className="p-5">

            <div className="mb-5 max-w-sm">

              <label className={labelClass}>Nutrition Basis</label>

              <select

                name="basis"

                value={formData.nutritionInformation.basis}

                onChange={handleNutritionChange}

                className={inputClass}

              >

                <option value="per 100g">Per 100g</option>

                <option value="per serving">Per Serving</option>

                <option value="per pack">Per Pack</option>

              </select>

            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {[

                ["energyKcal", "Energy", "kcal"],

                ["proteinG", "Protein", "g"],

                ["fatG", "Total Fat", "g"],

                ["saturatedFatG", "Saturated Fat", "g"],

                ["transFatG", "Trans Fat", "g"],

                ["carbohydratesG", "Carbohydrates", "g"],

                ["sugarG", "Sugar", "g"],

                ["cholesterolMg", "Cholesterol", "mg"],

              ].map(([name, label, unit]) => (

                <div key={name}>

                  <label className={labelClass}>

                    {label} ({unit})

                  </label>

                  <input

                    type="number"

                    name={name}

                    value={formData.nutritionInformation[name]}

                    onChange={handleNutritionChange}

                    min="0"

                    step="any"

                    placeholder={`Enter ${label.toLowerCase()}`}

                    className={inputClass}

                  />

                </div>

              ))}

            </div>

            <p className="mt-4 text-xs text-gray-400">

              Leave fields empty if the value is not available on the packaging.

            </p>

          </div>

        </div>

        {/* PRODUCT SETTINGS */}

        <div className={sectionClass}>

          <div className="border-b border-gray-100 px-5 py-4">

            <h2 className={sectionHeadingClass}>Product Settings</h2>

            <p className="mt-1 text-xs text-gray-500">

              Manage product visibility and labels.

            </p>

          </div>

          <div className="space-y-5 p-5">

            <div className="max-w-sm">

              <label className={labelClass}>Product Status</label>

              <select

                name="status"

                value={formData.status}

                onChange={handleChange}

                className={inputClass}

              >

                <option value="Active">Active</option>

                <option value="Inactive">Inactive</option>

              </select>

            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 p-4 transition hover:border-[#65C92E]/50 hover:bg-[#F7FAF5]">

              <input

                type="checkbox"

                name="isNew"

                checked={formData.isNew}

                onChange={handleChange}

                className="h-4 w-4 accent-[#65C92E]"

              />

              <div>

                <p className="text-sm font-semibold text-gray-700">

                  New Product

                </p>

                <p className="mt-1 text-xs text-gray-500">

                  Display a New label for this product.

                </p>

              </div>

            </label>

          </div>

        </div>

        {/* ACTION BUTTONS */}

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">

          <button

            type="button"

            onClick={handleReset}

            disabled={saving || processingImages}

            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"

          >

            <RotateCcw size={17} />

            Reset

          </button>

          <button

            type="submit"

            disabled={saving || loadingCategories || processingImages}

            className="flex items-center justify-center gap-2 rounded-lg bg-[#65C92E] px-7 py-3 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#58B925] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"

          >

            {saving ? (

              <>

                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#111111]/30 border-t-[#111111]" />

                {isEditMode ? "Updating..." : "Saving..."}

              </>

            ) : (

              <>

                <Save size={17} />

                {isEditMode ? "Update Product" : "Save Product"}

              </>

            )}

          </button>

        </div>

      </form>

    </div>

  );

};

export default ProductForm;

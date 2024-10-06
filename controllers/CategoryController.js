import Category from "../models/category.js";
import serverErrorsHandler from "./helper.js";

export default class CategoryController {
    static async createCateogry(request, response) {
        try {
            const { name } = request.body;
            if (!name) {
                return response.status(400).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 400,
                        "details": "Category name is required."
                    }
                })
            }
            const user_id = request.user._id;
            const category = await Category.create({
                name,
                user_id
            });
            response.status(200).json({
                "status": "success",
                "message": `You've created the category ${category.name} in successfully`,
                "data": category
            })
        } catch (error) {
            serverErrorsHandler(response, error)
        }
    }

    static async retrieveCategories(request, response) {
       const user_id = request.user._id;
       try {
        const categories = await Category.find({user_id});
        if (!categories) {
            response.status(404).json({
                "status": "error",
                "message": "You've not created any categories yet!",
                "error": {
                    "code": 404,
                }
            })
        }
        response.status(200).json({
            "status": "success",
            "message": `Here's all your categories`,
            "data": categories
        })
       } catch (error) {
        serverErrorsHandler(response, error);
       }
    }

    static async updateCateogry(request, response) {
        try {
            const { cateogryId } = request.params;
            const updateData = request.body;
    
            if (!cateogryId) {
                return response.status(400).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 400,
                        "details": "Cateogry ID is required."
                    }
                });
            }
    
            const updatedCat = await Category.findByIdAndUpdate(
                cateogryId,
                updateData,
                { new: true }
            );
    
            if (!updatedCat) {
                return response.status(404).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 404,
                        "details": "Category not found."
                    }
                });
            }
    
            response.status(200).json({
                "status": "success",
                "message": "Category updated successfully.",
                "data": updatedCat
            });
    
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }

    static async deleteCateogry(request, response) {
        try {
            const { cateogryId } = request.params;
    
            if (!cateogryId) {
                return response.status(400).json({
                    "status": "error",
                    "message": "An error occurred.",
                    "error": {
                        "code": 400,
                        "details": "Cateogry ID is required."
                    }
                });
            }
            try {
                await Category.findByIdAndDelete(cateogryId);
                response.status(200).json({
                    "status": "success",
                    "message": "Category deleted successfully.",
                    "data": []
                });
            } catch (error) {
                serverErrorsHandler(response, error);
            }
        } catch (error) {
            serverErrorsHandler(response, error);
        }      
    }

    static async deleteAllCategories(request, response) {
        try {
            const userId = request.user._id;
    
            const result = await Category.deleteMany({ user_id: userId });
    
            response.status(200).json({
                status: "success",
                message: `${result.deletedCount} categories deleted successfully.`,
            });
        } catch (error) {
            serverErrorsHandler(response, error);
        }
    }
}

import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken"

const checkValidJWT = (req: Request, res: Response, next: NextFunction) => {
    const path = req.path;

    // ✅ whitelist: bỏ qua check JWT cho login (có thể thêm /register nếu muốn)
    const whiteList = [
        "/login",
        "/add-product-to-cart"
    ];

    const isWhiteList = whiteList.some(route => route === path);
    if (isWhiteList) {
        next();
        return;
    }

    const token = req.headers['authorization']?.split(' ')[1];
    try {
        if (!token) {
            return res.status(401).json({
                data: null,
                message: "Không có token trong header"
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                data: null,
                message: "Thiếu JWT_SECRET trong server config"
            });
        }

        const dataDecoded: any = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: dataDecoded.id,
            username: dataDecoded.username,
            fullName: "",
            address: "",
            phone: "",
            password: "",
            accountType: dataDecoded.accountType,
            avatar: dataDecoded.avatar,
            roleId: dataDecoded.roleId,
            role: dataDecoded.role
        };

        next(); // ✅ chỉ gọi next khi token hợp lệ
    } catch (error) {
        return res.status(401).json({
            data: null,
            message: "Token không hợp lệ (không truyền lên token hoặc token hết hạn)"
        });
    }
}

export {
    checkValidJWT
}

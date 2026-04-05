"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var image_1 = require("next/image");
var link_1 = require("next/link");
var react_1 = require("react");
var skeleton_1 = require("@/components/ui/skeleton");
function Home() {
    var _a = react_1.useState({
        error: false,
        loading: false,
        data: []
    }), meals = _a[0], setMeals = _a[1];
    function getMealsCategory() {
        return __awaiter(this, void 0, void 0, function () {
            var res, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setMeals({
                            error: false,
                            loading: true,
                            data: []
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch("https://www.themealdb.com/api/json/v1/1/categories.php")];
                    case 2:
                        res = _a.sent();
                        if (!res.ok) {
                            throw new Error("An error has occurred");
                        }
                        return [4 /*yield*/, res.json()];
                    case 3:
                        result = _a.sent();
                        console.log(result);
                        setMeals({
                            error: false,
                            loading: false,
                            data: result.categories
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        if (error_1 instanceof Error) {
                            console.error(error_1.message);
                        }
                        else {
                            console.error(error_1);
                        }
                        setMeals({
                            error: true,
                            loading: false,
                            data: []
                        });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    react_1.useEffect(function () {
        getMealsCategory();
    }, []);
    return (React.createElement("div", { className: " w-full" },
        React.createElement("h1", { className: " text-center font-extrabold text-5xl" }, "Welcome to Flavor"),
        React.createElement("div", { className: " mt-5 flex flex-col items-center" },
            React.createElement("h1", { className: " text-center font-bold text-3xl" }, "Discover some amazing dishes"),
            React.createElement(link_1["default"], { className: " mt-5 text-lg font-medium", href: "/explore" }, "Explore user recipes"),
            meals.error ? (React.createElement("p", { className: " mt-5 text-red-600 font-medium text-center" }, "Something went wrong")) : meals.loading ? (React.createElement("div", { className: "flex flex-wrap justify-center gap-2" }, Array.from({ length: 10 }).map(function (_, i) { return (React.createElement("div", { key: i, className: "flex flex-col gap-1.5 sm:gap-2" },
                React.createElement(skeleton_1.Skeleton, { className: "rounded-lg bg-gray-300/30 w-[200px] h-[200px]" }),
                React.createElement(skeleton_1.Skeleton, { className: "h-4 w-[200px] bg-gray-300/30 rounded" }))); }))) : (React.createElement("div", { className: " mt-10 flex flex-wrap justify-center gap-5" }, meals.data.map(function (element) { return (React.createElement(link_1["default"], { href: "/category/" + element.strCategory, key: element.idCategory },
                React.createElement("div", { className: " border border-transparent p-2 bg-gray-50 rounded-sm shadow flex flex-col items-center gap-2" },
                    React.createElement(image_1["default"], { src: element.strCategoryThumb, alt: element.strCategory, width: 200, height: 200, className: " object-cover rounded-sm" }),
                    React.createElement("p", null, element.strCategory)))); }))))));
}
exports["default"] = Home;

class apiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        const queryStringObj = { ...this.queryString };
        const execludedFields = ['limit', 'page', 'sort', 'fields', 'keyword'];
        execludedFields.forEach((c) => delete queryStringObj[c]);
        let queryStr = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const field = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(field);
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }
        return this;
    }

    Search(modelName) {
        if (this.queryString.keyword) {
            const query = {};
            if (modelName === 'Products') {
                query.$or = [
                    { title: { $regex: this.queryString.keyword, $options: 'i' } },
                    {
                        description: {
                            $regex: this.queryString.keyword,
                            $options: 'i',
                        },
                    },
                ];
            }
            else {
                query.$or = [
                    { name: { $regex: this.queryString.keyword, $options: 'i' } }
                ];
            }
            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }

    Paginate(countDocuments) {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 50;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;
        const pagination = {};

        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit);

        if (endIndex < countDocuments) {
            pagination.next = page + 1;
        }
        if (skip > 0) {
            pagination.previous = page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination;
        return this;
    }
}

module.exports = apiFeatures;

const Tour = require('./../modules/tourModel');

const aliasTopTours = (req, res, next) => {
  req.query.limit = 3;
  req.query.sort = 'price';
  req.query.fields = 'n ame,price,summary,description';
  next();
};

const getToursAll = async (req, res) => {
  try {
    // BUILD Query
    //1A) Filtering

    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((val) => delete queryObj[val]);

    //1B) Advanced Filter
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 3) Sorting

    if (req.query.sort) {
      console.log(req.query.sort);
      const querySort = req.query.sort.split(',').join(' ');
      query = query.sort(querySort);
    } else {
      query = query.sort('createdAt');
    }

    // 4) Field limiting
    if (req.query.fields) {
      const queryField = req.query.fields.split(',').join(' ');
      query = query.select(queryField);
    } else {
      query = query.select('-__v');
    }

    //5 Pagination

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numberDocuments = await Tour.numberDocuments();
      if (skip >= numberDocuments) {
        throw new Error('This page does not exist');
      }
    }

    const data = await query;

    res.status(200).json({
      status: 'Success',
      results: data.length,
      tour: {
        data: data,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};
const addTour = async (req, res) => {
  // const data = new Tour(req.body);
  // data
  //   .save()
  //   .then((result) => {
  //     console.log(result);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  try {
    const data = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      tour: {
        data: data,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const getTourItem = async (req, res) => {
  console.log(req.params.id);
  try {
    const data = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      tour: {
        data: data,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const data = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'Document update',
      tour: {
        data: data,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const data = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Document Deleted',
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err,
    });
  }
};

module.exports = {
  getToursAll,
  addTour,
  updateTour,
  deleteTour,
  getTourItem,
  aliasTopTours,
};

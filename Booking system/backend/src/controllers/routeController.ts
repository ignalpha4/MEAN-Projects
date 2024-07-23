import routeModel from "../models/routesmodel";

export const createRoute = async (req: any, res: any) => {

  try {
    const { uniqueIdentifier, stations } = req.body;

    const newRoute = new routeModel({
      uniqueIdentifier,
      stations,
    });

    await newRoute.save();

    return res.status(201).json(newRoute);

  } catch (error) {
    console.log(error);
    return res.json({message:error});
  }

};

export const getRoutes = async (req: any, res: any) => {

  try {
      const routes = await routeModel.find();

    if (!routes) {
      return res.json({ success: false, message: "Routes not found" });
    }
    res.json({ success: true, routes });

  } catch (error) {
    console.log(error);
    return res.json({success:false,message:error});
  }
};

export const getRoutesById = async (req: any, res: any) => {

  try {
    let id = req.params.id;

    const route = await routeModel.findById(id);

    if (!route) {
      return res
        .status(404)
        .json({ success: false, message: "Routes not found" });
    }
    res.json({ success: true, route:route });

  } catch (error) {
        console.log(error);
    return res.json({success:false,message:error});
  }

};




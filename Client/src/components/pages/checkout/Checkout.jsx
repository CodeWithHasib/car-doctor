import React, { useContext } from 'react';
import { useLoaderData } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthProviders';

const Checkout = () => {
    const data = useLoaderData();
    console.log(data)
    const { user } = useContext(AuthContext);
    const handelFormSubmit = e => { 
        e.preventDefault();
        // console.log(e.target)
        const email = user?.email;
        
        const date  = e.target.date.value  ;
    }
    return (
        <div className='mt-11'>
            <h1 className='text-4xl text-center my-14'>Name : <span className='text-primary font-bold'>{data.title}</span></h1>
            <div className="flex justify-center ">
                <form  className="my-8">
                    <div className="flex gap-5">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="text" placeholder="email" defaultValue={user?.email} className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Date</span>
                            </label>
                            <input type="date" name='date' placeholder="Date" className="input w-56 input-bordered" />
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input type="text" defaultValue={user?.displayName} placeholder="Name" required className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="text" placeholder="password" className="input input-bordered" />
                        </div>
                    </div>
                    <div className="">
                        <textarea name="message" placeholder='Message' id="message" className='w-full outline-none border-2 h-40 my-5 rounded-xl resize-none px-3 py-1' cols="30" rows="10"></textarea>
                    </div>
                    <button className='btn btn-block'>Book Now</button>
                </form >
            </div>
        </div>
    );
};

export default Checkout;

import './discountModal.css';

const DiscountModal = (props) => {
    const Address = props.address;
    const discounts = props.discount;
    const showDiscountModal = props.showDiscountModal;
    return (
        <div className="modal show"  tabIndex="2">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">لیست تخفیفات شما</h5>
                        <button type="button" className="btn-close" onClick={showDiscountModal} ></button>
                    </div>
                    {discounts.map(d=>{
                        return(
                        d.state==="active"&&(
                            d.expiredDate>=new Date()&&(
                        <div className="modal-body">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                <h5 className="card-title">{d.name}</h5>
                                <p className="card-text">{d.description}</p>
                                <p className="card-text">کد تخفیف:{d.code}</p>
                                </div>
                                <div className="row mt-4">
                                    <div className="col-6">
                                        <p>تاریخ انقضا:{new Date((d.expiredDate)).toLocaleDateString('fa-IR')}</p>
                                    </div>
                                    <div className="col-6">
                                        <p>وضعیت:{d.state}</p>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>)))
                    }
                    )}
                    
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={showDiscountModal}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DiscountModal;
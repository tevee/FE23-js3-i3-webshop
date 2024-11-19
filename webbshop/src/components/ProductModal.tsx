/* 
  ProductModal Component
  Responsible for rendering Bootstraps modal
  Using redux to manually handle closing the modal with a boolean (true/false).
  Opening the modal handles in the SearchResult Component.
  Modal functionality is from Bootstraps own Javascript API.
*/

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectIsProductModalOpen, setIsProductModalOpen, selectFocusedProduct } from "../redux/webshopSlice";
import {useRef, useEffect, useCallback} from 'react';
import {Modal} from 'bootstrap';

export default function ProductModal():JSX.Element {

  const dispatch = useAppDispatch();
  const isProductModalOpen = useAppSelector(selectIsProductModalOpen);
  const product = useAppSelector(selectFocusedProduct);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Memoize the function to ensure it doesn't lose its reference
  // Making sure inside the useEffect that the event listener references correct function
  // and cleans up the correct function
  const closeProductModal = useCallback(() => {
    dispatch(setIsProductModalOpen(false));
  }, [dispatch]);

  // Make sure only one modal is created and let Bootstraps javascript API handle its own functionality
  // The only thing we do is setting our modal state to either true/false when the modal is opened/closed
  useEffect(() => {
    const modalElement = modalRef.current;
    if(modalElement) {
      let modal = Modal.getInstance(modalElement);
      if(!modal) modal = new Modal(modalElement);

      if(isProductModalOpen) modal.show();
      else modal.hide();

      // Manually set isProductModalOpen state to false when closing modal with backdrop,
      // meaning clicking outside of the modal.
      modalElement.addEventListener('hidden.bs.modal', closeProductModal as EventListener);
      
      return () => {
        modalElement.removeEventListener('hidden.bs.modal', closeProductModal as EventListener);
      }
    }
  }, [isProductModalOpen, closeProductModal])

  return (
    <div className="modal fade" ref={modalRef} tabIndex={-1} aria-labelledby="myModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="myModalLabel">{product?.title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={closeProductModal}
            ></button>
          </div>
          <div className="modal-body">
            <span>Brand: {product?.brand}</span>
            <span>Category: {product?.category}</span>
            <span>Height: {product?.dimensions.height}</span>
            <span>Width: {product?.dimensions.width}</span>
            <span>Description: {product?.description}</span>
          </div>
          <div className="modal-footer">
            <span>Product ID: {product?.id}</span>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={closeProductModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
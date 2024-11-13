import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectIsProductModalOpen, setIsProductModalOpen, selectFocusedProduct } from "../redux/webshopSlice";
import {useRef, useEffect, useCallback} from 'react';
import {Modal} from 'bootstrap';

export default function ProductModal():JSX.Element {

  const dispatch = useAppDispatch();
  const isProductModalOpen = useAppSelector(selectIsProductModalOpen);
  const product = useAppSelector(selectFocusedProduct);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Memoize the function to ensure it doesn't change on every render
  const closeProductModal = useCallback(() => {
    dispatch(setIsProductModalOpen(false));
  }, [dispatch]);

  useEffect(() => {
    const modalElement = modalRef.current;
    if(modalElement) {
      let modal = Modal.getInstance(modalElement);
      if(!modal) modal = new Modal(modalElement);

      if(isProductModalOpen) {
        modal.show();
      } else {
        modal.hide();
      }

      // This is for updating isProductModalOpen state to false when closing modal with backdrop,
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
          <h5 className="modal-title" id="myModalLabel">{product?.name}</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={closeProductModal}
          ></button>
        </div>
        <div className="modal-body">
          <span>Description: {product?.description}</span>
          <span>Category: {product?.category}</span>
          <span>Type: {product?.clothingType}</span>
          <span>Size: {product?.size}</span>
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
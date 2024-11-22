document.addEventListener('alpine:init', () => {
   Alpine.store('jobcard', {
      customers: [],
      vehicles: [],
      // states
      show_customers: false,
      show_vehicles: false,
      customer_picker: false,
      vehicle_picker: false,
      closeForm(){
         this.show_customers = false
         this.show_vehicles = false
      }
   })
   
})
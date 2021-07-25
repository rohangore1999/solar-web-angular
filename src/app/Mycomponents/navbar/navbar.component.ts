import { Component, OnInit, Input, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AddtoCartComponent } from '../addto-cart/addto-cart.component';
import { AuthService } from 'src/app/Services/auth.service';

declare const filterSelection: any
declare const show_all: any

export interface data {
  title: string;
  price: string;
  qty: number;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() Fil: string
  item: any;
  localItem: string;
  cartitems=[];
  cart_len;
  datasub_len:number

  cart_length = 1;

  constructor(private auth: AuthService, private bottomSheet: MatBottomSheet) {
    
   }

  ngOnInit(): void {
    
    // getting data from local storage
    this.localItem = localStorage.getItem("cartitem");

    // parsing localstorage data
    this.cartitems = JSON.parse(this.localItem);

    this.auth.changeDataSub(this.cartitems.length)

    // From BEHAVIORSUBJECT getting the Cartlength Because it is giving length at any page
    this.auth.currentData.subscribe(dataSub => {
      console.log("This currentData BEHAVIORSUBJECT")
      console.log(dataSub)
      this.datasub_len = dataSub
    })

    // As Nav bar is loading for all pages. When it is loaded as first time it will ask local storage for exisitng data
    // After refresh click on directly add product it was not updating. So we get items from serive
    this.auth.getMsg().subscribe((item: data) => {
      console.log(item)
      
      // it will update the localstorage with the item which service send so that to load without loading the MyCART page
      this.addProductToCart(item)

      // getting data from local storage
      this.localItem = localStorage.getItem("cartitem");
     
      // parsing localstorage data
      this.localItem = JSON.parse(this.localItem);

      // it will send updated  data after remove
      this.auth.changeDataSub(this.localItem.length)
    })
    

      
  }

  filterSelection1(fil) {
    filterSelection('all');
  }

  openAddToCartSheet() {
    this.bottomSheet.open(AddtoCartComponent)
  }

  addProductToCart(item: data) {

    let productExist = false;

    // getting data from local storage
    this.localItem = localStorage.getItem("cartitem");
     
    // parsing localstorage data
    this.localItem = JSON.parse(this.localItem);

    for (let i in this.cartitems) {
      if (this.cartitems[i].productName === item.title) {
        console.log("INCREASE QUANTITY")
        this.cartitems[i].qty++

        localStorage.setItem("cartitem", JSON.stringify(this.cartitems));
        productExist = true
        break;
      }
    }

    if (!productExist) {

      console.log("PUSH")
      this.cartitems.push({
        productName: item.title,
        price: item.price,
        qty: 1,
      })

      localStorage.setItem("cartitem", JSON.stringify(this.cartitems));
    }
    

  }


}

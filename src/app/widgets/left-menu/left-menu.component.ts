import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LandingFixService } from 'src/app/services/landing-fix.service';
import { MENUITEMS, Menu } from './left-menu-items';
declare var $: any;

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css'],
})
export class LeftMenuComponent implements OnInit {

  public menuItems: Menu[];
  _listUrl = 'subcategory/list';
  _pageNo = 0;
  _displayRecord = 0;
  _sortColumnName = 'id';
  _sortOrderName = 'DESC';
  _searchTerm = '';
  activecategory;
  private getCategoryList: Subscription;
  currentUrl
  constructor(
    private fix: LandingFixService,private http:HttpClient,
    private activatedRoute:ActivatedRoute,private route: ActivatedRoute,
    private router:Router
    
  ) { 
    this.route.params.subscribe(params => {
        this.activecategory = params['subcategory'];
       console.log("this.activecategory",this.activecategory);
    });
  }

  ngOnInit() {
    this.menuItems = MENUITEMS.filter(menuItem => menuItem);
    console.log('this.menuItems', this.menuItems);
    this.subcategory = this.activatedRoute.snapshot.params.subcategory;
    this.getCategory();
    this.getDesignerLebel();
  }
  lists:any = {};
  designerlists:any = {};
  condition = false;
  templateA;
  submenu = true;
  subcategory;
  getCategory()
  {
    let api = 'category/viewByCategoryName';
    this.getCategoryList =  this.http.get(api).subscribe(
      (res:any) => {
        console.log("MENULIST",res);
        this.lists = res;
      },
      (error:any) => {
        console.log("error",error);
        
      })
      
      
  }
 
  getDesignerLebel()
  {
    let api = 'designer/getDesignerCategory';
    this.getCategoryList =  this.http.get(api).subscribe(
      (res:any) => {
        console.log("MENULIST",res);
        this.designerlists = res;
      },
      (error:any) => {
        console.log("error",error);
        
      })
      
      
  }
  GoNav(url)
  {
    this.currentUrl = url;
    this.router.navigate(['designer-list/'+url])
    .then(() => {
      window.location.reload();
    });
  }
  men = false;
  women = false;
  kids = false;
  designer = false;
  categoryName;
  collapse(url){
    if(url == 'Men')
    {
      this.men = !this.men;
      this.women = false;
      this.kids = false;
      this.designer = false;

    }else if(url == 'Women')
    {
      this.men = false;
      this.women = !this.women;
      this.kids = false;
      this.designer = false;

    }else if(url == 'Kid')
    {
      this.men = false;
      this.women = false;
      this.kids = !this.kids;
      this.designer = false;

    }else if(url == 'Designer')
    {
      this.men = false;
      this.women = false;
      this.kids = false;
      this.designer = !this.designer;

    }
    console.log(url);
    this.categoryName = url;
  }

  closeNav() {
    this.fix.removeNavFix();
  }

}

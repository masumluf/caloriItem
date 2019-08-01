// Storage Controller
const StorageCtrl=(function(){
    return{
        storeItem:function(item){
            let items;
            if(localStorage.getItem('items')===null){
                items=[];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }else{
                items=JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemByStorage:function(){
            let items;

            if(localStorage.getItem('items')===null){
                items=[];
            }else{
                items=JSON.parse(localStorage.getItem('items'));
                
            }
            return items;
        }
    }
})();









// Item Controller

const ItemCtrl=(function(){
    const Item=function(id,name,calories){
        this.id=id;
        this.name=name;
        this.calories=calories;
    }
    const data={
        item:StorageCtrl.getItemByStorage(),
        currentItem:null,
        totalCalories:0
    }
    return{
        getItems:function(){
            return data.item;
        },
        getCalories:function(){
            let total=0;
            data.item.forEach(function(item){
                total +=item.calories;
                
            })
            data.totalCalories=total;
            return data.totalCalories;
        },
        getItemById:function(id){
            let found=null;
            data.item.forEach(function(i){
                if(i.id===id){
                    found=i;
                    //console.log(i);
                }
            });
            return found;

        },
        setCurrentItem:function(id){
            data.currentItem=id;
        },
        getCurrentItem:function(){
            return data.currentItem;
        },
        UpdatedItem:function(name,calorie){
            calorie=parseInt(calorie);
            let found=null;
            data.item.forEach(function(i){
               if(i.id===data.currentItem.id){
                   i.name=name;
                   i.calories=calorie;
                   found=i;
               }
            })
            return found;
        },
        clearItem:function(){
            data.item=[];
        },
        logData:function(){
            return data;
        },
        addItem:function(name,calorie){

            //unique id generation

            let Id;
            if(data.item.length>0){
                Id=data.item[data.item.length-1].id+1;
            }else{
                Id=0;
            }

            calorie=parseInt(calorie);
            newItem=new Item(Id,name,calorie);
            data.item.push(newItem);

            return newItem;
        },
        deleteCurrentItem:function(id){
            // const ids=data.item.map(function(item){
            //     return item.id;
            // });
            // const index=ids.indexOf(id);
            // console.log(id);

            data.item.splice(id,1);
        }
    }
 })();






 
 //  UI Controller 
 const UICtrl=(function(){
    
    const UISelector={
        itemList:   '#item-list',
        listItem:   '#item-list li',
        addbtn:     '.add-btn',
        updatebtn:  '.update-btn',
        deletebtn:  '.delete-btn',
        backbtn:    '.back-btn',
        itemName:   '#item-name',
        calories:   '#item-calories',
        clearAll:   '.clear-btn'
    }

    //public method
    return{
        populateItems:function(items){
            let html='';
            items.forEach(function(item){
                html += ` <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories}</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li> `;
            })
            document.querySelector(UISelector.itemList).innerHTML=html;
        },
        getInputValue:function(){
            return {
                name:document.querySelector(UISelector.itemName).value,
                calories:document.querySelector(UISelector.calories).value
            }
        },
        updateTotalCalories:function(finalCalories){
            
            document.querySelector('.total-calories').textContent=finalCalories;
            //console.log(finalCalories);
        },
        addListItem:function(items){
        document.querySelector(UISelectors.itemList).style.display = 'block';
        const li=document.createElement('li');

        li.className='collection-item';

        li.id=`item-${items.id}`;

        li.innerHTML=` <strong>${items.name}: </strong> <em>${items.calories}</em>
                        <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                        </a>`;

                        document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend', li)
    },
    updateListItem:function(item){
        let listItems=document.querySelectorAll(UISelector.listItem);
       listItems=Array.from(listItems);
       listItems.forEach(function(listItem){
           const itemId=listItem.getAttribute('id');
           if(itemId===`item-${item.id}`){
               document.querySelector(`#${itemId}`).innerHTML=` <strong>${item.name}: </strong> <em>${item.calories}</em>
               <a href="#" class="secondary-content">
               <i class="edit-item fa fa-pencil"></i>
               </a>`;
           }
       });
        //console.log(listItems);
    },
   
    clearItemField:function(){
        return {
            name:document.querySelector(UISelector.itemName).value='',
            calories:document.querySelector(UISelector.calories).value=''
        }
    },
    addItemtoForm:function(){
             document.querySelector(UISelector.itemName).value=ItemCtrl.getCurrentItem().name,
             document.querySelector(UISelector.calories).value=ItemCtrl.getCurrentItem().calories
    }
    ,
    showEditState:function(){
        document.querySelector(UISelector.updatebtn).style.display='inline';
        document.querySelector(UISelector.deletebtn).style.display='inline';
        document.querySelector(UISelector.backbtn).style.display='inline';
        document.querySelector(UISelector.addbtn).style.display='none';
    },
    hideButton:function(){
        document.querySelector(UISelector.updatebtn).style.display='none';
        document.querySelector(UISelector.deletebtn).style.display='none';
        document.querySelector(UISelector.backbtn).style.display='none';
        document.querySelector(UISelector.addbtn).style.display='inline';
    },
    deleteListItem: function(id){
        const itemID=`#item-${id}`;
        const item=document.querySelector(itemID);
        item.remove();

    },
    clearItem:function(){
       let item= document.querySelectorAll(UISelector.itemList);
       item=Array.from(item);
       item.forEach(function(i){
           i.remove();
       })
        //console.log('cleared.');
    },
    getSelector:function(){
            return UISelector;
        }
    }
})();
 








 // App Controller
 const AppCtrl=(function(ItemCtrl,UICtrl,StorageCtrl){
   
    // Load Event

    const loadEvent=function(){
    const uiSelector=UICtrl.getSelector();
    

    //Edit icon Click
    document.addEventListener('keypress',function(e){
        if(e.keyCode===13 || e.which===13){
            e.preventDefault();
            return false;
        }
    });

    // click for additem.

    document.querySelector(uiSelector.addbtn).addEventListener('click', itemAddSubmit);

    //click for editing

    document.querySelector(uiSelector.itemList).addEventListener('click',itemEditClick);

    // Item Update

    document.querySelector(uiSelector.updatebtn).addEventListener('click',itemUpdateClick);

    //click for delteItem

    document.querySelector(uiSelector.deletebtn).addEventListener('click',itemDeleteClick);

    //Clear All

    document.querySelector(uiSelector.clearAll).addEventListener('click',clearAllItem);
   

}
    const itemAddSubmit=function(e){
      
        const getinputvalue=UICtrl.getInputValue();
        if(getinputvalue.name !=='' && getinputvalue.calories !==''){
            const newItem=ItemCtrl.addItem(getinputvalue.name, getinputvalue.calories);
            UICtrl.addListItem(newItem);
            const finalCalories=ItemCtrl.getCalories();
            UICtrl.updateTotalCalories(finalCalories);
            UICtrl.clearItemField();
            StorageCtrl.storeItem(newItem);
        }
        
        e.preventDefault();
    }
    const itemUpdateClick=function(event){
        
        const input=UICtrl.getInputValue();

        const updateItem=ItemCtrl.UpdatedItem(input.name, input.calories);

        UICtrl.updateListItem(updateItem);

        const finalCalories=ItemCtrl.getCalories();
            UICtrl.updateTotalCalories(finalCalories);
            UICtrl.clearItemField();
            UICtrl.hideButton();
        event.preventDefault();       
    }
  
    const itemEditClick=function(e){
        if(e.target.classList.contains('edit-item')){
            const itemId=e.target.parentNode.parentNode.id;
            const itemIdsplit=itemId.split('-');
            const id=parseInt(itemIdsplit[1]);
            const getItemById= ItemCtrl.getItemById(id);
            ItemCtrl.setCurrentItem(getItemById);
            UICtrl.showEditState();
            UICtrl.addItemtoForm();
           
        }
        e.preventDefault();
    }

    const itemDeleteClick=function(e){
        const currentItem=ItemCtrl.getCurrentItem();
        ItemCtrl.deleteCurrentItem(currentItem.id);
        UICtrl.deleteListItem(currentItem.id);
        UICtrl.clearItemField();
            UICtrl.hideButton();
            const finalCalories=ItemCtrl.getCalories();
            UICtrl.updateTotalCalories(finalCalories);
        e.preventDefault();
    }

    const clearAllItem=function(){
        ItemCtrl.clearItem();
        UICtrl.clearItem();
        const finalCalories=ItemCtrl.getCalories();
        UICtrl.updateTotalCalories(finalCalories);
        
    }
  
   
         return{
             init:function(){
                const items=ItemCtrl.getItems();
                UICtrl.populateItems(items);
                UICtrl.updateTotalCalories(); 
                UICtrl.hideButton();
                loadEvent(); 
             }
         }
})(ItemCtrl,UICtrl,StorageCtrl);

AppCtrl.init();
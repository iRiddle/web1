import React from "react";
import NavBar from "../NavBar";
import MainMenu from "../MainMenu";
import { connect } from 'react-redux';

/**
 * * Functional wrapper component for NavBar and Main Menu
 */
 class NavMenuWrapper extends React.Component {
   render() {
     const {
       selectedMenuIndex,
       handleMenuItemChange,
       menuItems,
       userProfile,
       showMainMenu,
       showHome,
       handleViewProfile,
       language: languageMap
     } = this.props;
     return (
       <div>
         <NavBar
           userProfile={userProfile}
           handleViewProfile={handleViewProfile}
           showHome={showHome}
           languageMap={languageMap}
         />

         {showMainMenu && (
           <MainMenu
             menuItems={menuItems}
             value={selectedMenuIndex}
             handleMenuItemChange={handleMenuItemChange}
             languageMap={languageMap}
           />
         )}
       </div>
     );
   }
}

const mapStateToProps = state => {
   return {
     language: state.language.language
   }
}
//
// const mapDispatchToProps = dispatch => {
//    return bindActionCreators(
//      setP
//    )
// }

export default connect(mapStateToProps)(NavMenuWrapper);

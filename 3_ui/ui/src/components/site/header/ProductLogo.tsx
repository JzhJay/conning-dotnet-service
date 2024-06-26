import * as css from './SiteHeader.css';
import {user} from 'stores'

export const ProductLogo = () => (
            <div className={css.productLogo}>
                <div className="text" data-tip data-for="indicator">
                    <span>site.productName</span>
                    <sup>®</sup>
                </div>
            </div>)
